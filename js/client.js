$(document).ready(function () {
	$('#chat').hawkChat({
		userId: CHAT_CONTROL.userId, //id пользователя
		serverSideUrl: 'Chat.php', //адрес серверного скрипта
		groupName: CHAT_CONTROL.groupName, //группа куда будут добавлены все пользователи
		useTabs: false, //скрываем табы
		useUserList: false, //скрываем список пользователей
		inline: false, //делаем чат перетаскиваемым
		title: 'Задайте нам вопрос', //заголовок чата
		inMessageFormat: '<div class="chat-row triangle-right left" title="{time}"> \
			<div class=""> \
				<span class="chat-row-login">{from_login}</span>: \
				<span class="chat-row-message">{message}</span> \
			</div> \
		</div>', //меняем формат входящего сообщения
		outMessageFormat: '<div class="chat-row triangle-right right" title="{time}"> \
			<div class=""> \
				<span class="login">Вы</span>: \
				<span class="message">{message}</span> \
			</div> \
		</div>', //меняем формат исходящего сообщения
		openWithUser: [CHAT_CONTROL.manager], //открываем вкладку с менеджером
		onInMessage: function(msg, str) {
			if(msg.event === 'hawk.chat_message')
			{
				var $body = $('.chat-mesasge-panel.active');
				if($body.find('.mCSB_container').size())
				{
					$body = $body.find('.mCSB_container');
				}
				$body.append(str);
			}
		} //добавляем обработчик входящего сообщения из панели администрирования
	});

	//при смене хэша сообщаем об этом в административную часть
	$('body').on('hashchange', function () {
		sendPage();
	});

	//анимация сворачивания/разворачивания чата
	var $body = $('.chat-body', '#chat');
	$('.chat-header', '#chat').dblclick(function () {
		var $container = $('.chat-container', '#chat');
		if($body.is(":visible"))
		{
			$body.hide();
			$container.stop().animate({
				height: '0px'
			}, 1000);
		}
		else
		{
			var to = '+=0px';
			$container.stop().animate({
				height: '465px',
				top: to
			}, 1000, 'linear', function () {
				$body.show();
				//если чат уехал за экран возвращаем его на место
				var offset = $container.offset();
				if(offset.top < 0)
				{
					$container.stop().animate({
						top: '+=' + offset.top|0 + 'px'
					})
				}
				$container.find('.chat-text-input').focus();
			});
		}

	});

	//прячем чат по-умолчанию
	$body.hide();
	$('.chat-container', '#chat').css({height: '0px'});

	//после инициализации подключения сообщаем о себе
	HAWK_API.bind_handler('initialized', sendPage);

	//каждые 15 секунд шлём пинги
	setInterval(sendPage, 15000);
});

/**
 * Функция шлёт пинг через заданный интервал
 * @returns {undefined}
 */
function sendPage()
{
	//определяем координаты пользователя
	if (navigator.geolocation && !CHAT_CONTROL.coords.length)
	{
        navigator.geolocation.getCurrentPosition(setPosition);
    }

	//формируем и шлём сообщение с пингом
	HAWK_API.send_message({
		event: 'hawk.ping', //событие которые будет вызвано при поступлении этого сообщения
		to: {
			group: [CHAT_CONTROL.groupName] //шлём сообщение в группу
		},
		text:{
			info:{
				page: document.location.href, //адрес страницы
				browser:{
					name: bowser.name, //название браузера
					version: bowser.version //версия браузера
				},
				coords: CHAT_CONTROL.coords //соординаты
			}
		}
	});
}

/**
 * Устанавливает координаты пользователя
 * @param {Оиоусе} position текущие координаты пользователя
 * @returns {undefined}
 */
function setPosition(position)
{
    CHAT_CONTROL.coords= [
		position.coords.latitude,
		position.coords.longitude
	];
}