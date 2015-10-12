<?php
if (session_status() != PHP_SESSION_ACTIVE)
{
	session_start();
	$_SESSION['user']['is_admin']	 = true;
	$_SESSION['user']['login']		 = 'admin';
}
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Hawk Analitics</title>
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

		<script type="text/javascript">
			var CHAT_CONTROL = {
				userId: '<?php echo $_SESSION['user']['login'] ?>',
				groupName: 'AllUsers'
			};
		</script>
    </head>
    <body>
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
    </body>
</html>

