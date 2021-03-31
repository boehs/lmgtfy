if (!window.location.origin) {
	window.location.origin =
		window.location.protocol +
		"//" +
		window.location.hostname +
		(window.location.port ? ":" + window.location.port : "");
}

/* 扩展一个getUrlParam的方法 */
$.getUrlParam = function (name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r !== null) return unescape(r[2]);
	return null;
};

$(function () {
	var $kw = $("#kw"),
		$searchSubmit = $("#search"),
		$urlOutput = $("#url-output"),
		$tips = $("#tips"),
		$stop = $("#stop"),
		$arrow = $("#arrow");

	var stepTimeout, typeInterval;

	var query = $.getUrlParam("q");
	var search = $.getUrlParam("s");
	if (!!query) {
		try {
			query = Base64.decode(query);
		} catch (e) {
			console.log(e);
		}
	}

	if (!!query) {
		$tips.html("Let me help you");
		$stop.fadeIn();

		stepTimeout = setTimeout(function () {
			$tips.html("1. Find the search bar and select it");

			$arrow
				.removeClass("active")
				.show()
				.animate(
					{
						left: $kw.offset().left + 20 + "px",
						top: $kw.offset().top + $kw.outerHeight() / 2 + "px",
					},
					2000,
					function () {
						$tips.html("2. Write your question");
						$arrow.addClass("active");

						stepTimeout = setTimeout(function () {
							$arrow.fadeOut();

							var i = 0;
							typeInterval = setInterval(function () {
								$kw.val(query.substr(0, i));
								if (++i > query.length) {
									clearInterval(typeInterval);
									$tips.html("3. Click on the search button");

									$arrow
										.removeClass("active")
										.fadeIn()
										.animate(
											{
												left:
													$searchSubmit.offset().left +
													$searchSubmit.width() / 2 +
													"px",
												top:
													$searchSubmit.offset().top +
													$searchSubmit.height() / 2 +
													"px",
											},
											1000,
											function () {
												$tips.html(
													"<strong>Don't torture people with your questions</strong>"
												);
												$arrow.addClass("active");

												stepTimeout = setTimeout(function () {
													if ($(".search-text").attr("data-site") == "google") {
														window.location =
															"https://www.google.com/search?q=" +
															encodeURIComponent(query);
													} else {
														window.location =
															"https://www.google.com/search?q=" +
															encodeURIComponent(query);
													}
												}, 1000);
											}
										);
								}
							}, 200);
						}, 500);
					}
				);
		}, 1000);
	}

	$stop.click(function () {
		clearTimeout(stepTimeout);
		clearInterval(typeInterval);
		$stop.hide();
		$arrow.stop().hide();
		$kw.val(query);
		query = false;
		$tips.html("Enter a question and press Google Search");
	});

	/* 提交 */
	$("#search").on("click", function () {
		if (!!query) return false;

		var question = $.trim($kw.val());
		if (!question) {
			$tips.html('<span style="color: red">Are you sure your ok?</span>');
			$kw.val("");
		} else {
			$tips.html("Copy the link below to teach dumbasses how to use Google");
			$("#output").fadeIn();
			$urlOutput
				.val(
					window.location.origin +
						window.location.pathname +
						"?q=" +
						Base64.encode(question)
				)
				.focus()
				.select();
		}
		return false;
	});

	/* 复制结果 */

	var clipboard = new ClipboardJS("[data-clipboard-target]");
	clipboard.on("success", function (e) {
		$tips.html('<span style="color: #4caf50">Copied successfully!</span>');
	});
	clipboard.on("error", function (e) {
		$tips.html(
			'<span style="color: red">Copy failed, please copy manually</span>'
		);
	});

	/* 预览 */

	$("#preview").click(function () {
		var link = $urlOutput.val();
		if (!!link) {
			window.open(link);
		}
	});

	/* 手气不错 */

	$("#search2").on("click", function () {
		window.location =
			"https://www.google.com/search?q=" +
			encodeURIComponent($("#kw").val()) +
			"&btnI=I'm+Feeling+Lucky";
	});
});

/* 关于 */
function showAbout() {
	var windowWidth = $(window).width();
	var windowHeight = $(window).height();
	var popupHeight = $("#msgbox").height();
	var popupWidth = $("#msgbox").width();
	$("#mask")
		.width(windowWidth)
		.height(windowHeight)
		.click(function () {
			hideAbout();
		})
		.fadeIn(200);
	$("#msgbox")
		.css({
			position: "absolute",
			left: windowWidth / 2 - popupWidth / 2,
			top: windowHeight / 2 - popupHeight / 2,
		})
		.fadeIn(200);
}
function hideAbout() {
	$("#mask").fadeOut(200);
	$("#msgbox").fadeOut(200);
}

function gtest() {
	var img = new Image();
	var timeout = setTimeout(function () {
		img.onerror = img.onload = null;
		$(".search-text").attr("data-site", "google2");
	}, 3000);
	img.onerror = function () {
		clearTimeout(timeout);
		$(".search-text").attr("data-site", "google2");
	};
	img.onload = function () {
		clearTimeout(timeout);
		$(".search-text").attr("data-site", "google");
	};
	img.src = "https://www.google.com/favicon.ico?" + +new Date();
}
window.onload = function () {
	gtest();
	window.setInterval("gtest()", 10000);
};
