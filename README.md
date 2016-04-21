# Электронный консультант основанный на [чате](https://github.com/postHawk/hawk_chat) [POST HAWK](https://github.com/postHawk)

Склонируйте репозиторий:
```bash
git clone https://github.com/postHawk/hawk_advisor
cd hawk_advisor
git submodule init && git submodule update
```
##Клиентская часть

Подключите скрипты:
```html
<link rel="stylesheet" type="text/css" href="Hawk_chat/src/hawk_chat.css"/>
<link rel="stylesheet" type="text/css" href="css/main.css"/>
<link rel="stylesheet" type="text/css" href="Hawk_chat/lib/jquery.mCustomScrollbar.min.css"/>

<script type="text/javascript" src="js/jquery-2.1.4.min.js"></script>
<script type="text/javascript" src="Hawk_chat/lib/jquery-ui.min.js"></script>
<script type="text/javascript" src="js/bowser.min.js"></script>
<script type="text/javascript" src="Hawk_chat/lib/jquery.mCustomScrollbar.concat.min.js"></script>
<script type="text/javascript" src="hawk_api/js/hawk_api.js"></script>
<script type="text/javascript" src="Hawk_chat/src/hawk_chat.js"></script>
<script type="text/javascript" src="js/client.js"></script>
```
Инициализируйте объект необходимыми значениями:
```javascript
<script type="text/javascript">
    //объект с информацией о текущем пользователе
    //и менеджере, который будет его обслуживать
    var CHAT_CONTROL = {
        userId: '<?php echo $_SESSION['user']['login'] ?>', //любой валидный id пользователя
        manager: '<?php echo 'admin' ?>', //id менеджера для текущего клиента
        groupName: 'AllUsers', //название группы, в которую будут добавлены все пользователи (для удобства наблюдения за ними)
        coords: [] //текущие координаты пользователя
    };
</script>
```
На этом всё. Если вы хотите модифицировать клиентскую часть, то обратитесь к файлу js/client.js. Файл подробно прокомментирован поэтому здесь мы его не будем рассматривать.

##Административная часть
Подключите файлы:
```html
<link rel="stylesheet" type="text/css" href="Hawk_chat/lib/jquery.mCustomScrollbar.min.css"/>
<link rel="stylesheet" type="text/css" href="Hawk_chat/src/hawk_chat.css"/>
<link rel="stylesheet" type="text/css" href="css/admin.css"/>

<script type="text/javascript" src="js/jquery-2.1.4.min.js"></script>
<script type="text/javascript" src="Hawk_chat/lib/jquery.mCustomScrollbar.concat.min.js"></script>
<script type="text/javascript" src="hawk_api/js/hawk_api.js"></script>
<script type="text/javascript" src="Hawk_chat/src/hawk_chat.js"></script>
<script type="text/javascript" src="js/highcharts/js/highcharts.js"></script>
<script src="//api-maps.yandex.ru/2.1/?lang=ru_RU" type="text/javascript"></script>
<script type="text/javascript" src="js/admin.js"></script>
```
Инициализируйте объект:
```javascript
<script type="text/javascript">
    var CHAT_CONTROL = {
        userId: '<?php echo $_SESSION['user']['login'] ?>',
        groupName: 'AllUsers'
    };
</script>
```
```html
<div class="wrapper">
    <div class="admin-header">
        <h1>Администрирование</h1>
    </div>
    <div>
        <div class="graphs">
            <div class="online-chart">
                <span style="font-size: 20pt">Сейчас</span> <br> <span style="font-size: 70pt" id="user_count">0</span> <br> онлайн
            </div>
        <div id="browsers"></div>
            <div id="chart"></div>
        </div>
        <div class="chat">
            <div id="chat"></div>
        </div>
        <h2>Пользователи на карте:</h2>
        <div id="map" class="map"></div>
    </div>
</div>
```
На этом всё. Если вы хотите модифицировать административную часть, то обратитесь к файлу js/admin.js. Файл подробно прокомментирован поэтому здесь мы его не будем рассматривать.
