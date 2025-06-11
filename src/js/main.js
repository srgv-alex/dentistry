const mobileNavBtn = document.querySelector('.mobile-nav-btn');
const mobileNavIcon = document.querySelector('.mobile-nav-btn__icon');
const mobileNavPanel = document.querySelector('.mobile-nav__panel');

mobileNavBtn.addEventListener('click', function () {
	mobileNavIcon.classList.toggle('active');
	mobileNavPanel.classList.toggle('visible');
	document.body.classList.toggle('no-scroll');
});

function turnoffmobileNav() {
	if (mobileNavBtn.classList.contains('active')) {
		mobileNavBtn.classList.remove('active');
	}
	if (mobileNavPanel.classList.contains('visible')) {
		mobileNavPanel.classList.remove('visible');
	}
	if (mobileNavIcon.classList.contains('active')) {
		mobileNavIcon.classList.remove('active');
	}
}

mobileNavPanel.querySelectorAll('a').forEach(function (link) {
	link.addEventListener('click', function () {
		turnoffmobileNav();
	});
});
