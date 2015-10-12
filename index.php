<?php
if (session_status() != PHP_SESSION_ACTIVE)
{
	session_start();
	$_SESSION['user']['is_admin']	 = false;
	$_SESSION['user']['login']		 = md5(session_id());
}
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Hawk Advisor</title>
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
		<script type="text/javascript">
			var CHAT_CONTROL = {
				userId: '<?php echo $_SESSION['user']['login'] ?>',
				manager: '<?php echo 'admin' ?>',
				groupName: 'AllUsers',
				coords: []
			};
		</script>
    </head>
    <body>
		<div id="chat"></div>
    </body>
</html>

