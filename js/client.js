$(document).ready(function () {
	$('#chat').hawkChat({
		userId: CHAT_CONTROL.userId, //id пользователя
		serverSideUrl: 'Chat.php', //адрес серверного скрипта
		groupName: CHAT_CONTROL.groupName,
		useTabs: false,
		useUserList: false,
		inline: false,
		title: 'Задайте нам вопрос',
		inMessageFormat: '<div class="chat-row triangle-right left" title="{time}"> \
			<div class=""> \
				<span class="chat-row-login">{from_login}</span>: \
				<span class="chat-row-message">{message}</span> \
			</div> \
		</div>',
		outMessageFormat: '<div class="chat-row triangle-right right" title="{time}"> \
			<div class=""> \
				<span class="login">Вы</span>: \
				<span class="message">{message}</span> \
			</div> \
		</div>',
		openWithUser: [CHAT_CONTROL.manager],
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
		}
	});

	$('body').on('hashchange', function () {
		sendPage();
	});

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

	$body.hide();
	$('.chat-container', '#chat').css({height: '0px'});

	HAWK_API.bind_handler('initialized', sendPage);

	setInterval(sendPage, 15000);

});

function sendPage()
{
	if (navigator.geolocation && !CHAT_CONTROL.coords.length)
	{
        navigator.geolocation.getCurrentPosition(setPosition);
    }

	HAWK_API.send_message({
		event: 'hawk.ping',
		to: {
			group: [CHAT_CONTROL.groupName]
		},
		text:{
			info:{
				page: document.location.href,
				browser:{
					name: bowser.name,
					version: bowser.version
				},
				coords: CHAT_CONTROL.coords
			}
		}
	});
}

function setPosition(position)
{
    CHAT_CONTROL.coords= [
		position.coords.latitude,
		position.coords.longitude
	];
}