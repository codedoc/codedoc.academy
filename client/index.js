window.logFlags = window.logFlags || {};

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
};

app.addEventListener('click link', onchange);

var start = function () {
  page('/', open('page-home'));
  page('/team', open('page-team'));
  page('/contact', open('page-contact'));
  page('/glossary', open('page-glossary'));
  page('/policy', open('page-policy'));
  page('*', open('page-home'));
  page();

  page.show(location.pathname);

  console.log('Welcome to Codedoc Academy!');
};

start();