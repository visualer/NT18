/* main.js */

//jshint undef: false
//jshint unused: false


function isPC() {
	"use strict";
	var userAgentInfo = navigator.userAgent;
	var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPod"]; //exclude iPad
	for (var v = 0; v < Agents.length; v++) {
		if (userAgentInfo.indexOf(Agents[v]) > 0) {
			return false;
		}
	}
	return true;
}

function scroll_main(width, number) {
	"use strict";
	var call;
	var s = $(".slider ul");
	var x = s,
		i;

	function scroll() {
		var pos = parseInt(s.css("left"));
		if (pos === -(width * number)) {
			s.css("left", 0);
			pos = 0;
		} else if ((0 - pos) % width !== 0) {
			pos = -Math.floor((0 - pos) / width) * width;
		}
		s.animate({
			left: pos - width
		}, 1000);
	}



	function setScrollElement(num) {
		var t = $("<li><img src='img/slider/slider%20(" + num.toString() + ").jpg' " +
			"style='width: " + width.toString() + "px'></li>");
		if (isPC()) {
			t.mouseover(function () {
				clearInterval(call);
			});
			t.mouseout(function () {
				call = setInterval(scroll, 5000);
			});
		}
		x.append(t);
	}

	setScrollElement(number);
	for (i = 1; i <= number; i++) {
		setScrollElement(i);
	}

	$(".slider").css({
		"width": width,
		"height": (width * 576 / 1024)
	});

	s.css({
		"width": width * (number + 1),
		"left": -width
	});
	call = setInterval(scroll, 5000);

} // scroll_main

function loadData(delay, id) {
	"use strict";
	if (arguments.length === 1) { //should analyze the params
		var href = window.location.href;
		var param = href.split("#?");
		id = "load";
		if (param.length > 1) {
			var p1 = param[1].split("=");
			if (p1[0] !== param[1] && p1[0] === "load") {
				id += p1[1];
			}
		}
		//got valid id or just remains "load"
		if (id === "load") {
			id += "Index";
		}
	}
	//start page or invalid param transfer

	var $article = $("article"),
		$id = $("#" + id),
		$prevDiv = $("#prevDiv");
	if ($id.length === 0) {
		/*window.location.href = "404.html";
		return;*/
		id = "load404";
		$id = $("#load404");
	}

	function afterLoad() {
		$article.html($id.val());
		var articleId = $article.attr("id");
		$id.attr("id", "prevDiv");
		if ($prevDiv.length !== 0) { //prevDiv exists		
			$prevDiv.attr("id", articleId);
		}
		$article.attr("id", id);

	}

	//effects part

	if ($article.attr("id") === id) {
		$("html, body").animate({
			scrollTop: 0
		}, 300);
		return;
	}

	if (delay !== 0) {
		$article.fadeOut(300, afterLoad);
		$("html, body").animate({
			scrollTop: 0
		}, 300);
		$article.fadeIn(300);
	} else {
		afterLoad();
	}
}

function panorama(divId, width, posID, povList, errDivId) {
	"use strict";
	var $divId = $("#" + divId);
	if (isPC()) {
		require(['async!BMap'], function () {
			$divId.css({
				"display": "block",
				"position": "relative",
				"left": (700 - width) / 2,
				"width": width,
				"height": width / 16 * 9
			});
			$divId.delay(200);
			var bMap = new BMap.Panorama(divId);
			bMap.setId(posID);
			bMap.setPov(povList);
		}, function () {
			$divId.css({
				"text-align": "center",
				"font-size": "20px"
			});
			$divId.html("[<b>Outer Javascript for panorama view failed.</b> Try to <a href='javascript:location.reload()'>Reload</a>]");
			$("#" + errDivId).css("display", "none");
		});
	} else {
		$divId.css({
			"text-align": "center",
			"font-size": "20px"
		});
		$divId.html("[<b>Panorama view not available for mobile.</b> Please use PC or iPad.]");
		$("#" + errDivId).css("display", "none");
	}
}


//
//
// functions end here
//
//

require.config({
	paths: {
		'async': ['js/vendor/require/async'],
		'BMap': ['http://api.map.baidu.com/api?v=2.0&ak=dQhc2gjwUxf5Ol3tZ2LAzZcizYWrzHFe']
	},
	shim: {
		'BMap': {
			exports: 'BMap'
		}
	}
});

var scrollbarWidth = (function () {
	"use strict";
	var w1, w2,
		div = $("<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'>" +
			"<div style='height:100px;width:auto;'></div></div>"),
		innerDiv = div.children()[0];

	$("body").append(div);
	w1 = innerDiv.offsetWidth;
	div.css("overflow", "scroll");

	w2 = innerDiv.offsetWidth;

	if (w1 === w2) {
		w2 = div[0].clientWidth;
	}

	div.remove();

	return w1 - w2;
})();

var globalWidth = (window.screen.width > 1280 ? window.screen.width : 1280) - scrollbarWidth;

// min-width = 1280 - scrollbarWidth
// here we got the globalWidth

if (isPC()) {
	$("<link>")
		.attr({
			"rel": "stylesheet",
			"type": "text/css",
			"href": "css/scrollbar.css"
		})
		.appendTo("head");
}


var x = document.getElementsByClassName("subNav"),
	i, sum = 0;
for (i = 0; i < x.length; i++) {
	x[i].style.width = (x[i].offsetWidth + 100).toString() + "px";
	sum += parseInt(x[i].style.width);
}
sum +=2;

// set subNav width
if (isPC()===false) {
	$("nav").css({
		"margin-left": (window.screen.width * window.devicePixelRatio - sum) / 2,
		"width": sum
	});
}
else {

	$("nav").css({
		"margin-left": (window.innerWidth - sum) / 2,
		"width": sum
	});
}

var n = $("#newsBlock");
n.find("ul li a").css("width",
	(n.find("ul").height() > 98) ?
	((navigator.userAgent.indexOf("Chrome") > -1) ? 240 : 260 - 10 - scrollbarWidth) : 250);


var k = $("article");


if (isPC()===false) {
	$("aside").css("margin-left", window.innerWidth / 20);
	k.css("left", window.innerWidth / 20 + 200);
	$("body").css("width", window.screen.width * window.devicePixelRatio+20);
} 
else {
	$("aside").css("margin-left", (window.innerWidth - 1000) / 2);
	k.css("left", (window.innerWidth - 500) / 2);
	$("body").css("width", window.innerWidth - scrollbarWidth-2);
}

$("#StarHead").css("padding-left", window.innerWidth / 10);

//change elements paddings when the window's size changed. by Stardust.
$(window).resize(function () {
	"use strict";
	if (isPC() === false) {
		$("nav").css({
			"margin-left": (window.screen.width * window.devicePixelRatio - sum) / 2,
			"width": sum
		});
	} else {

		$("nav").css({
			"margin-left": (window.innerWidth - sum) / 2,
			"width": sum
		});
	}
	if (isPC() === false) {
		$("aside").css("margin-left", window.innerWidth / 20);
		k.css("left", window.innerWidth / 20 + 250);
		$("body").css("width", window.screen.width * window.devicePixelRatio * 1.2);
	} else {
		$("aside").css("margin-left", (window.innerWidth - 1000) / 2);
		k.css("left", (window.innerWidth - 500) / 2);
		$("body").css("width", window.innerWidth - scrollbarWidth-2);
	}
	$("#StarHead").css("padding-left", window.innerWidth / 10);

});


// set width of DOM elements

loadData(0);

// load default HTML template: loadIndex
var $maskLayer = $("#maskLayer"),
	$img = $maskLayer.find("img");

$(function () {
	"use strict";
	$maskLayer.delay(1000);
	$img.delay(1000);
	$img.animate({
		"left": "+=1%",
		"top": "+=2%",
		"opacity": "0"
	}, 600);
	$maskLayer.animate({
		"opacity": "0"
	}, 600, function () {
		$maskLayer.css("display", "none");
	});
});

//to deal with th iphone bug that the nav can't work well when hover. by Stardust
$(".subNav").mouseenter(function () {
	"use strict";
	$(this.children).css("display", "block");
});
$(".subNav").mouseleave(function () {
	"use strict";
	$(".subNav ul").css("display", "none");
});



// well done!