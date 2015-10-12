/**
 *Oбъект статистики
 * @type {Object}
 */
var STAT = {
	/**
	 * Информация о пользователях
	 * @type {Object}
	 */
	userInfo: {},
	/**
	 * На каких страницах находятся пользователи
	 * @type {Object}
	 */
	pageToUser: {},
	/**
	 * Объект графика пользователей
	 * @type {Object}
	 */
	pageGraph: null,
	/**
	 * Объект графика браузеров
	 * @type {Object}
	 */
	browserGraph: null,
	/**
	 * Запущен ли процесс обновления графика пользователей
	 * @type Boolean
	 */
	graphPageUpdating: false,
	/**
	 * Запущен ли процесс обновления браузеров
	 * @type Boolean
	 */
	graphBrowserUpdating: false,
	objectManager: null
};

$(document).ready(function () {
	//инициализируем чат
	$('#chat').hawkChat({
		userId: CHAT_CONTROL.userId, //id пользователя
		serverSideUrl: 'Chat.php', //адрес серверного скрипта
		groupName: CHAT_CONTROL.groupName, //группа куда будут добавлены все пользователи
		onInMessage: function(msg, str) {
			if(msg.event === 'hawk.ping')
			{
				return false;
			}

			msg.text.from_login = msg.text.from_login.substr(0, 10);

			return -1;
		}//добавляем обработчик входящего сообщения для модификации логина пользователя
	});

	//инициализируем графики
    initGraphs();

	//подписываемся на пинг от пользователя
	HAWK_API.bind_handler('ping', onUserPing);
	//подписываемся на обновление списка пользователей
	HAWK_API.bind_handler('get_by_group', onUserList);
});

/**
 * Функция обрабатывает пользовательское сообщение
 * @param {Object} e событие
 * @param {Object} msg сообщение
 * @returns {undefined}
 */
function onUserPing(e, msg)
{
	//сохраняем или обновляем информацию о пользователе
	var info = msg.text.info;
	STAT.userInfo[msg.from] = info;

	//записываем текущую страницу пользователя
	if(!STAT.pageToUser.hasOwnProperty(info.page))
	{
		STAT.pageToUser[info.page] = [];
	}

	//и добавляем его в массив пользователей страницы
	if($.inArray(msg.from, STAT.pageToUser[info.page]) === -1)
	{
		STAT.pageToUser[info.page].push(msg.from);
	}
}

/**
 * Обновляем инормацию о пользователях
 * @param {Object} e событие
 * @param {Object} msg сообщение
 * @returns {undefined}
 */
function onUserList(e, msg)
{
	var onlineUsers = [];
	msg.result.forEach(function (record) {
		for(var gname in record)
		{
			record[gname].users.forEach(function (user) {
				if (user.online)
				{
					if($.inArray(user.user, onlineUsers) === -1)
					{
						onlineUsers.push(user.user);
					}
				}
				else if (!user.online)
				{
					if (STAT.userInfo.hasOwnProperty(user.user))
					{
						delete STAT.userInfo[user.user];
					}
					//убираем оффлайн пользователей из группы
					HAWK_API.remove_user_from_group([gname], user.user);
				}
			});
		}
	});

	var pages = STAT.pageToUser;
	//перебираем циклом все имеющиеся страницы
	for(var page in pages)
	{
		//фильтруем пользователей на странице
		pages[page] = pages[page].filter(function (pUser) {
			//если пользователя нет на странице, удаляем его
			if($.inArray(pUser, onlineUsers) === -1 || STAT.userInfo[pUser].page !== page)
				return false;

			return true;
		});

		//если пользователей на странице не осталось удаляем страницу
		if(!pages[page].length)
		{
			delete pages[page];
		}
	}

	$('#user_count').html(onlineUsers.length);

	//обновляем графики и карту
	updatePageGraph();
	updateBrowserGraph();
	updateMap();
}

/**
 * Обновляем информацию на графиках страниц
 * @returns {undefined}
 */
function updatePageGraph()
{
	//если процесс обновления уже запущен возвращаемся
	if(STAT.graphPageUpdating)
	{
		return;
	}

	STAT.graphPageUpdating = true;

	//формируем серии для графика
	var series = [];
	var pages = STAT.pageToUser;
	for(var page in pages)
	{
		series.push([page, pages[page].length]);
	}

	//обновляем графики
	var chart = STAT.pageGraph.highcharts();
	chart.series[0].setData(series);
	chart.redraw();

	STAT.graphPageUpdating = false;
}

/**
 * Обновляем информацию на графиках пользователей
 * @returns {undefined}
 */
function updateBrowserGraph()
{
	//если процесс обновления уже запущен возвращаемся
	if(STAT.graphBrowserUpdating)
	{
		return;
	}

	STAT.graphBrowserUpdating = true;

	var browsers = {};
	var users = STAT.userInfo;

	//перебираем информацию пользователей
	for(var user in users)
	{
		var browser = users[user].browser;
		if(!browser)
		{
			continue;
		}

		//формируем строку с названием браузера
		browser	= browser.name.toString().substr(0, 10) + ' '
				+ ((browser.version) ? ' (' + browser.version + ')' : '(не определено)');
		//считаем количество браузеров
		if(!browsers.hasOwnProperty(browser))
		{
			browsers[browser] = 0;
		}

		browsers[browser]++;
	}

	//формируем сирии для графика
	var series = [];
	for(var browser in browsers)
	{
		series.push([browser, browsers[browser]]);
	}

	//обновляем график
	var chart = STAT.browserGraph.highcharts();
	chart.series[0].setData(series);
	chart.redraw();

	STAT.graphBrowserUpdating = false;
}

/**
 * Функция первоначальной инициализации графиков
 * @returns {undefined}
 */
function initGraphs()
{
	//график пользователей
	STAT.pageGraph = $('#chart').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Пользователи на страницах'
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
            title: {
                text: 'Количество пользователей'
            }

        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    format: '{point.y}'
                }
            }
        },

        tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
        },

        series: [{
			name: "Страницы",
			colorByPoint: true,
			data: []
		}]
    });
	//график браузеров
	STAT.browserGraph = $('#browsers').highcharts({
		chart: {
            type: 'pie'
        },
        title: {
            text: 'Браузеры'
        },
        tooltip: {
            pointFormat: '{series.name} <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b> {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            name: "Браузеры",
            colorByPoint: true,
            data: []
        }]
	});
}
//подписываемся на инициализацию карты
ymaps.ready(initMap);

/**
 * Функция выполняет инициализацию карты
 * @returns {undefined}
 */
function initMap () {
	//создаём карту
    var myMap = new ymaps.Map("map", {
            center: [55.76, 37.64],
            zoom: 2,
			controls: ['zoomControl', 'searchControl', 'typeSelector']
        }, {
            searchControlProvider: 'yandex#search'
        });

	//создаём менеджер объектов
	STAT.objectManager = new ymaps.ObjectManager({
		// Чтобы метки начали кластеризоваться, выставляем опцию.
		clusterize: true,
		// ObjectManager принимает те же опции, что и кластеризатор.
		gridSize: 32
	});

	myMap.geoObjects.add(STAT.objectManager);
}

/**
 * Функция обновляет информацию
 * о пользователях на карте
 * @returns {undefined}
 */
function updateMap()
{
	if(!STAT.objectManager)
	{
		return;
	}
	//очищаем карту
	STAT.objectManager.removeAll();
	var users = STAT.userInfo;
	//формируем новый массив координат пользователей
	var points = [];
	for(var user in users)
	{
		if(users[user].coords && users[user].coords.length)
		{
			points.push({
				type: "Feature",
				id: user,
				geometry: {
					type: "Point",
					coordinates: users[user].coords
				},
				properties: {
					draggable: false
				}
			});

		}
	}

	//добавляем на карту
	STAT.objectManager.add(points)
}