//============================== ПРОВЕРКА МОБИЛЬНОГО БРАУЗЕРА =====================
var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};
//=========================== ОТКРЫВАЕМ ФОРМУ =========================
//написано на JS на случай, если на сайте не подключен JQuery
function viewChat() {
    var btn = document.getElementById("view-chat-button");
    btn.style.display = "none";
    var box = btn.parentNode;
    if(isMobile.any()){
    	box.style.width = "100vw";
    	box.style.height = "100vh";
    	btn.classList.contains("right")?box.style.right = "0em" : box.style.left = "0em";
	}
	else {
		box.classList.add("box-chat-iframe");
		btn.classList.contains("right")?box.style.right = "1em" : box.style.left = "1em";
	}
	if (document.getElementById("chat-iframe")) {
		document.getElementById("chat-iframe").style.display = "block";
	}
	else {
		var tmpElem = document.createElement("div");
	  tmpElem.innerHTML = '<iframe id="chat-iframe" class="online-version" src="imperionchat.html" style="width:100%;height:100%">';
	  var iframe = tmpElem.firstChild;
	  box.appendChild(iframe);
		return iframe;
	}
}

//============================ СВОРАЧИВАЕМ ЧАТ ==============================
function hideChat() {
	var iframe = document.defaultView.frameElement;
	var btnOn = window.parent.document.getElementById("view-chat-button");
	var box = btnOn.parentNode;
	iframe.style.display = "none";
	btnOn.style.display = "block";
	box.classList.remove("box-chat-iframe");
}

//============================= ОТПРАВИТЬ ДРУГОЕ СООБЩЕНИЕ ===================
function viewChatForm() {
	$('#chat-form-offline-answer').hide();
	$('#chat-form-online').show();
	$("#chat-form-textarea-message").val("");

}

//============================= ПРОВЕРКА ПОЛЕЙ ВВОДА =========================

//показываем нужную форму----------------->
function init() {
		$('#chat-form-online').show();

		var phone 		 	 = document.getElementById("chat-form-input-phone");
		var name 		 		 = document.getElementById("chat-form-input-name");
		var email        = document.getElementById("chat-form-input-mail");
		var message 	 	 = document.getElementById("chat-form-textarea-message");
		var submitButton = document.getElementById("chat-form-button-submit");
		var form 		 		 = document.getElementById("chat-form-online");
		var maskValue 	 = "+375 (__) ___ __ __";//шаблон маски ввода телефона
		var coursorValue = 6;//позиция, в которой должен находиться курсор в зависимости от маски ввода
		var nameValue;
		var emailValue;
		var id;
		var n;
		var p;
		var e;
		var m;
		var a;
		var d;// дата сообщения
		var cookieId = 'id';
    var cookieOptions = {expires: 3};
    var pingInt = true;//флаг для запуска/остановки ping()
		
		//определение событий----------------->

		//клик по полю "Ваш телефон"
		phone.onclick = function() {
			//прячем запись после сработки validForm()
			if (this.value == "Введите полный номер") {
				this.value = ""
			}
			//показываем маску и ставим курсор в нужном месте
			if (this.value == "") {
				this.value = maskValue;
				setCursorPosition (this,coursorValue);
			}
			//убираем красный цвет после проверки
			if (this.classList.contains('warning')) {
				this.classList.remove('warning');
			}
			//убираем подсказку после проверки
			if (document.getElementById('warning-phone').style.display=="block") {
				document.getElementById('warning-phone').style.display="none";
			}
		}

		//клик по полю "Имя" 
		name.onclick = function() {
			//прячем запись после сработки validForm()
			if (this.value == "Введите имя") {
				this.value = ""
			}
			//прячем маску телефона
			phonePlaceholder();
			//убираем красный цвет после проверки
			if (this.classList.contains('warning')) {
				this.classList.remove('warning');
			}
		}

		//клик по полю "Email" 
		email.onclick = function() {
			//прячем запись после сработки validForm()
			if (this.value == "Введите e-mail") {
				this.value = ""
			}
			//прячем маску телефона
			phonePlaceholder();
			//убираем красный цвет после проверки
			if (this.classList.contains('warning')) {
				this.classList.remove('warning');
			}
		}

		//клик по полю "Сообщение" 
		message.onclick = function() {
			//прячем запись после сработки validForm()
			if (this.value == "Введите сообщение") {
				this.value = ""
			}
			//прячем маску телефона
			phonePlaceholder();
			//убираем красный цвет после проверки
			if (this.classList.contains('warning')) {
				this.classList.remove('warning');
			}
		} 

		//клик по кнопке "Начать чат"
		submitButton.onclick = function() {
			validForm();
			return false;
		}

		//клик по кнопке "Завершить чат"
		$('#main-chat-close-button').click( function() {
			$('#main-chat').hide();
			$('#chat-form-online').show();
			$('#chat-form-textarea-message').val("");
			//останавливаем ping()
			pingInt = false;
		})

		//потеря фокуса ввода поля "Имя"
		name.onblur = function() {
			validName(this);
		}

		//потеря фокуса ввода поля "Email"
		email.onblur = function() {
			validEmail(this);
		}

		//потеря фокуса ввода поля "Телефон"
		phone.onblur = function() {
			validPhone(this);
		}

		//вводим данные в поле "Телефон"согласно маске
		phone.addEventListener("input", mask, false);


		//функции----------------------------->

		//-----------ПРОВЕРКА ИМЕНИ (JS) ------------

		//проверка поля "Имя"
		function validName(item) {
			nameValue = item.value.match(/^[А-Яа-яЁёA-Za-z]+$/g);///^[А-Яа-яЁёA-Za-z\-\s]+$/g - вариант, где допускаются пробелы и "-"
			if (nameValue == null && name.value != "") {
				name.value = "Неверный формат";
				name.classList.add('warning');
				name.onclick = function() {
					name.value = "";
					name.classList.remove('warning');
				}
			}
		}//end validName()

		//---------------- ПРОВЕРКА EMAIL (JS) -----------------------------------
		function validEmail(item) {
			emailValue = item.value.match(/[a-zа-я]+@[a-zа-я]+\.[a-zа-я]{2,4}/i);
			if (emailValue == null && email.value != "") {
				email.value = "Неверный формат";
				email.classList.add('warning');
				email.onclick = function() {
					email.value = "";
					email.classList.remove('warning');
				}
			}
		}

		//------------------ПРОВЕРКА ТЕЛЕФОНА (JS)-----------------

		//Если номер телефона в поле не был введен, меняем маску обратно на placeholder
		function phonePlaceholder() {
			if(phone.value == maskValue) {
				phone.value = "";
				phone.placeholder = "Номер";
			}
		}//end phonePlaceholder()

		//Ставим курсор в нужную позицию для начала ввода текста 
		function setCursorPosition(item, pos) {
			if(item.setSelectionRange) {
				item.focus();
				item.setSelectionRange(pos,pos);
			}
			else if (item.createTextRange) {
				var range = item.createTextRange();
				range.collapse(true);
				range.moveEnd("character", pos);
				range.moveStart("character", pos);
				range.select();
			}
		}// end setCursorPosition()

		//Меняем в маске подчеркивания и пробелы на цифры
		function mask(event) {
			var matrix = maskValue,
			i = 0,
			def = matrix.replace(/\D/g, ""),
			val = this.value.replace(/\D/g, "");
			def.length >= val.length && (val = def);
			matrix = matrix.replace(/[_\d]/g, function(a) {return val.charAt(i++) || "_"});
			this.value = matrix;
			i = matrix.lastIndexOf(val.substr(-1));
			i < matrix.length && matrix != this.defaultValue ? i++ : i = matrix.indexOf("_");
			setCursorPosition(this,i);
		}//end mask()

		function validPhone(item) {
			if (phone.value != "" && phone.value.match(/_/) && phone.value != maskValue) {
				phone.classList.add('warning');
				document.getElementById('warning-phone').style.display="block";
			}
		}

		//----------------ПРОВЕРКА ПЕРЕД ОТПРАВКОЙ (JS) И ОТПРАВКА(AJAX) ---------------

		//функция проверки заполнения полей формы после нажатия кнопки
		function validForm() {	
			if (phone.value.match(/_/) || phone.value == "" || phone.value == "Введите полный номер" || name.value == "Неверный формат" || nameValue == null || name.value == "Введите имя" || message.value == "" || message.value == "Введите сообщение" || email.value == "Неверный формат" || emailValue == null || email.value == "Введите e-mail") {
				if (phone.value.match(/_/) || phone.value == "" || phone.value == "Введите полный номер") {
					phone.value = "Введите полный номер";
					phone.classList.add("warning");
				}
				if (name.value == "Неверный формат" || nameValue == null || name.value == "Введите имя") {
					name.value = "Введите имя";
					name.classList.add("warning");
				}
				if (email.value == "Неверный формат" || emailValue == null || email.value == "Введите e-mail") {
					email.value = "Введите e-mail";
					email.classList.add("warning");
				}
				if (message.value == "" || message.value == "Введите сообщение") {
					message.value = "Введите сообщение";
					message.classList.add("warning");
				}
				return false;
			}
			else {
				//если на компьютере сохранены куки imperionchat, значит, посетитель уже регистрировался
				//вызываем conn (a = 2)
				if($.cookie(cookieId)) {
					conn();
				}
				else {
				//если куков нет - вызываем reg (a = 3)
				//на серверной стороне имеет смысл проверка прежней регистрации по параметрам n, p, e
					reg();
				}
			}
		}//end validForm 

		//========================== reg (a = 3) ============================
		function reg() {
      if($.cookie(cookieId)) {
      	id = $.cookie(cookieId);
      }
      n = $("#chat-form-input-name").val();
      p = $("#chat-form-input-phone").val();
      e = $("#chat-form-input-mail").val();
      m = $("#chat-form-textarea-message").val();
      a = 3;
      $.ajax({
          url: "http://178.63.61.221/serverside/imperionchat/",
          type: "GET",
          dataType: "json",
          data: {'a':'3','id':id,'n':n,'e':e,'p':p,'m':m},
          success: function(dataResp) {
          	$.cookie(cookieId, dataResp[0][0], cookieOptions);
          	$("#chat-form-online").hide();
          	if(dataResp[1][0] == 'Manager OFFLINE') {//==
          		$("#chat-form-offline-answer").show();
	            $('#chat-form-offline-answer-message-name').text(n);
	            $('#chat-form-offline-answer-message-phone').text(p);
	            $('#chat-form-offline-answer-message-email').text(e);
	            $('#chat-form-offline-answer-message-text').text(m);
          	}
          	else {
          		$("#main-chat").show();
          		ping();
          	}
          }
        })
    	}//end reg

   	//=============================== conn (a = 2) ============================ 
    function conn() {
    	id = $.cookie(cookieId);
    	n = $("#chat-form-input-name").val();
    	p = $("#chat-form-input-phone").val();
    	e = $("#chat-form-input-mail").val();
    	m = $("#chat-form-textarea-message").val();
    	$.ajax({
    		url: "http://178.63.61.221/serverside/imperionchat/",
    		type: "GET",
    		dataType: "json",
    		data: {'a':'2','id':id},
    		success: function(dataResp) {
    			$("#chat-form-online").hide();
    			//если менеджер оффлайн
        	if(dataResp[1][0] == 'Manager OFFLINE') {//==
        		$("#chat-form-offline-answer").show();
            $('#chat-form-offline-answer-message-name').text(n);
            $('#chat-form-offline-answer-message-phone').text(p);
            $('#chat-form-offline-answer-message-email').text(e);
            $('#chat-form-offline-answer-message-text').text(m);
        	}
          //менеджер онлайн
    			else {
    				$("#main-chat").show();
    				//выводим первое сообщение с формы входа
    					$('#main-chat-container').append(
    						'<div class="row chat-row"><div class="col-xs-12 col-sm-12 col-md-10 col-col-lg-10 col-md-offset-1 col-lg-offset-1"><div class="main-chat-item"><div class="col-xs-2 col-sm-2 col-md-1 col-lg-1 user img"><img src="img/putin.jpg" alt="user image" class="main-chat-item-img"></div><div class="col-xs-10 col-sm-10 col-md-10 col-lg-10 user"><div class="main-chat-item-message"><p class="main-chat-item-message-name">'+n+'</p>'+m+'<p class="main-chat-item-message-date">'+setDate(true)+'</p></div><div class="clean"></div></div></div></div></div><!-- /row -->'
    					);
    					$('#main-chat-container').scrollTop($('#main-chat-container').prop('scrollHeight'));
						//отправка сообщения происходит по нажатию клавиши Enter
    				$('#main-chat-textarea').keydown (function(event) { 
  						if (event.keyCode == 13) { 
  					    send();
  					  }
						 });
	    			if(dataResp[0][0]=='No id history found.') {//!=
  						//здесь массив истории переписки должен быть преобразован в html-код посредством js "на лету" и отображен в виде чата
  						//т.к. у меня нет структуры возращаемого массива истории пока я не могу этого сделать
	    			}
							//запускаем ping(a = 0)
		    			ping();
    			}
				}
    	})
    }//end conn

    //================================ send (a = 1) ===========================
    function send() {
    	id = $.cookie(cookieId);
    	m = $('#main-chat-textarea').val();
    	n = $("#chat-form-input-name").val();
    	d = new Date();
    	$.ajax({
    		url: "http://178.63.61.221/serverside/imperionchat/",
    		type: "GET",
    		dataType: "json",
    		data: {'a':'1','id':id,'m':m},
    		success: function(dataResp) {
    			//console.log(dataResp[0][0]);
    			if(dataResp[0][0] == '1') {
    				$('#main-chat-textarea').val('').attr("placeholder", "Введите свое сообщение");
    				//выводим на экран отправленное сообщение
    				$('#main-chat-container').append(
    					'<div class="row chat-row"><div class="col-xs-12 col-sm-12 col-md-10 col-col-lg-10 col-md-offset-1 col-lg-offset-1"><div class="main-chat-item"><div class="col-xs-2 col-sm-2 col-md-1 col-lg-1 user img"><img src="img/putin.jpg" alt="user image" class="main-chat-item-img"></div><div class="col-xs-10 col-sm-10 col-md-10 col-lg-10 user"><div class="main-chat-item-message"><p class="main-chat-item-message-name">'+n+'</p>'+m+'<p class="main-chat-item-message-date">'+setDate(true)+'</p></div><div class="clean"></div></div></div></div></div><!-- /row -->'
    				);
    				$('#main-chat-container').scrollTop($('#main-chat-container').prop('scrollHeight'));		
    			}
    		}
    	})
    }//end send

		//============================== ping (a = 0) ============================
    function ping() {
    	var pingId = $.cookie(cookieId);
    	pingInt = true;
    	function getPing(){
    		$.ajax({
    			url: "http://178.63.61.221/serverside/imperionchat/",
    			type: "GET",
    			dataType: "json",
    			data: {'a':'0','id':pingId},
    			success: function(dataResp) {
    				//выводим входящие сообщения
    				var arr = dataResp[0];
    				arr.forEach(function(item,i,arr) {
    					$('#main-chat-container').append(
    					'<div class="row chat-row"><div class="col-xs-12 col-sm-12 col-md-10 col-col-lg-10 col-md-offset-1 col-lg-offset-1"><div class="main-chat-item"><div class="col-xs-2 col-sm-2 col-md-1 col-lg-1 stuff img"><img src="img/merkel.jpg" alt="stuff image" class="main-chat-item-img"></div><div class="col-xs-10 col-sm-10 col-md-10 col-lg-10 stuff"><div class="main-chat-item-message"><p class="main-chat-item-message-name">Imperionchat</p>'+item+'<p class="main-chat-item-message-date">'+setDate(true)+'</p></div><div class="clean"></div></div></div></div></div><!-- /row -->'
    				);
    					 $('#main-chat-container').scrollTop($('#main-chat-container').prop('scrollHeight'));	
    				})
    			}
    		})
    		if(pingInt == false) {	// нажимаем "Завершить чат" - останавливаем ping()
    			clearInterval(interval);
    		}
    	}
    	var interval = setInterval(function(){getPing()}, 1000);
    }//end ping

    //============================= setDate ===========================
    //функция возвращает дату в нужном формате, напр.: пн, 22:00:16
    //аргументы: i[true/false] - если нужно теперешнее время - ставим true, ранее заданное - false
    //					dateMessage (необязательный аргумент) - дата, которую необходимо преобразовать, формат данных - Date.
    //функция также возвращает день недели, если дата не сегодняшняя
    function setDate(i,dateMessage) {
    	var date = new Date(),
    		hours = date.getHours(),
    		minutes = date.getMinutes(),
    		seconds = date.getSeconds(),
    		day = date.getDay(),
    		nameDay,
    		dateFormat;
    	if (i == true) {
    		dateFormat = hours+":"+minutes+":"+seconds;
    		return dateFormat;
    	}
    	else {
    		dayMessage = dateMessage.getDay();
    		if(day != dayMessage) {
    			switch (dayMessage) {
    				case 0: nameDay = "вс"; break;
    				case 1: nameDay = "пн"; break;
    				case 2: nameDay = "вт"; break;
    				case 3: nameDay = "ср"; break;
    				case 4: nameDay = "чт"; break;
    				case 5: nameDay = "пт"; break;
    				case 6: nameDay = "сб"; break;
    			}
    			dateFormat = nameDay+", "+hours+":"+minutes+":"+seconds;
    			return dateFormat;
    		}
    		else {
    			dateFormat = hours+":"+minutes+":"+seconds;
    			return dateFormat;
    		}
    	}
    }//end setDate

}
//init