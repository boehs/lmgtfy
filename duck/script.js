// social icons display on click

// navbar collapse
const navbarCollapse = document.querySelector(".navbar-collapse");
const navShowBtn = document.getElementById("navbar-toggler");
const navCloseBtn = document.getElementById("nav-close-btn");
const modal = document.getElementById("modal");

navShowBtn.addEventListener("click", () => {
	navbarCollapse.classList.add("show-navbar-collapse");
	modal.classList.add("fullscreenModal");
});

navCloseBtn.addEventListener("click", () => {
	navbarCollapse.classList.remove("show-navbar-collapse");
	modal.classList.remove("fullscreenModal");
});

window.addEventListener("click", (e) => {
	if (e.target === modal) {
		navbarCollapse.classList.remove("show-navbar-collapse");
		modal.classList.remove("fullscreenModal");
	}
});

// faq collapsible
const faqHeadIcons = document.querySelectorAll(".faq-head span");
const faqHeadTitles = document.querySelectorAll(".faq-head h3");
const faqBodyContents = document.querySelectorAll(".faq-body");

// while clicking title
faqHeadTitles.forEach((title) => {
	title.addEventListener("click", () => {
		faqBodyHide();
		faqIconReset();
		title.parentElement.nextElementSibling.classList.add("show-faq-body");
		title.previousElementSibling.innerHTML =
			'<img src = "assets/icons/up.svg">';
	});
});

// while clicking icon
faqHeadIcons.forEach((icon) => {
	icon.addEventListener("click", () => {
		faqBodyHide();
		faqIconReset();
		icon.parentElement.nextElementSibling.classList.add("show-faq-body");
		icon.innerHTML = '<img src = "assets/icons/up.svg">';
	});
});

function faqBodyHide() {
	faqBodyContents.forEach((body) => {
		body.classList.remove("show-faq-body");
	});
}

function faqIconReset() {
	faqHeadIcons.forEach((icon) => {
		icon.innerHTML = '<img src = "assets/icons/down.svg">';
	});
}

$.getUrlParam = function (name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r !== null) return unescape(r[2]);
	return null;
};

$(function () {
	var $kw = $("#search-box"),
		$searchSubmit = $("#search"),
		$urlOutput = $("#url-output"),
		$tips = $("#tips"),
		$stop = $("#stop"),
		$arrow = $("#arrow");

	var stepTimeout, typeInterval;

	var query = $.getUrlParam("q");
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
											2000,

											function () {
												var button = document.getElementById("search");
												button.classList.add("green");
												$tips.html(
													"<strong>Don't torture people with your questions</strong>"
												);
												$arrow.addClass("active");

												stepTimeout = setTimeout(function () {
													if ($(".search-text").attr("data-site") == "google") {
														window.location =
															"https://www.duckduckgo.com/" +
															encodeURIComponent(query);
													} else {
														window.location =
															"https://www.duckduckgo.com/" +
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

	var clipboard = new ClipboardJS("[data-clipboard-target]");
	clipboard.on("success", function (e) {
		$tips.html('<span style="color: #4caf50">Copied successfully!</span>');
	});
	clipboard.on("error", function (e) {
		$tips.html(
			'<span style="color: red">Copy failed, please copy manually</span>'
		);
	});
});
