// google analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-56515755-1']);
_gaq.push(['_trackPageview']);

// app boot
window.logFlags = window.logFlags || {};
const host_re = /^[www\.]?hackfaber\.com/;
var hostname = window.location.hostname;
var host_query = host_re.exec(hostname);
var env = host_query && host_query[0] === 'hackfaber.com' ? 'production' : 'develop';
var production = function () { return env === 'production'; };

var app = document.getElementById('app');

var open = function (page_name, details) {
  return function (context) {
    var element = document.createElement(page_name);
    context.element = element;
    while (app.firstChild) app.removeChild(app.firstChild);
    app.appendChild(element);
    element.details = details;
    scroll(0,0);
  };
};

var onchange = function (event) {
  var url = event.detail;
  page.show(url);
  if (production()) {
    _gaq.push(['_trackPageview', url]);
  }
};

app.addEventListener('click link', onchange);

var start = function () {
  page('/', open('page-home'));
  page('/contact', open('page-contact'));
  page('/faber', open('page-faber'));
  page('/glossary', open('page-glossary'));
  page('/home', open('page-home'));
  page('/program', open('page-program'));
  page('/policy', open('page-policy'));
  page('/team', open('page-team'));
  page('*', open('page-home'));
  page();

  page.show(location.pathname);

  console.log('Welcome to HackFaber!');
};

start();
