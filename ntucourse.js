//為了避免 require(../../../routes)這種情形
//新增一個 _require 方法可直接從根目錄引入
var path = require('path');
global._require = function(_path) {
    return require(path.join(__dirname, _path));
}

var config = _require('/config.json');

//===== DATABASE =====
var db = _require('/service/db');

//===== LOG CONFIG =====
var logger = require('log4js').getLogger(__dirname);

var express = require('express');
var app = express();
var bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	session = require('express-session'),
	cookieSession = require('cookie-session'),
	MemcachedStore = require('connect-memcached')(session),
	cookieParser = require('cookie-parser'),
	path = require('path'),
	favicon = require('serve-favicon');
var router = express.Router();

//===== DEV ENVIRONMENT CONFIG =====
var env = process.env.NODE_ENV || 'development';
if(env === 'development') {
	var errorHandler = require('errorhandler'),
		morgan = require('morgan');
	app.use(morgan('dev'));
	app.use(errorHandler());
}

//===== EXPRESS CONFIG =====
app.set('trust proxy', 1);
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cookieParser());
app.use(cookieSession({
	name: 'hs',
	maxAge: 1000 * 60 * 60 * 1,
	path: '/',
	keys: [config.session.keys],
	secret: config.session.secret
}));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(require('less-middleware')(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Origin' , '*');
	res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
	res.header('Access-Control-Allow-Headers', 'X-Forwarded-or, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
	res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
	res.header('Pragma', 'no-cache');
	res.header('Expires', 0);
	next();
});
app.listen(7350);

//引入一堆route
var Route = {
	index:    _require('/routes/index'),
	user:     _require('/routes/user/index'),
	users:    _require('/routes/users/index'),
	schedule: _require('/routes/schedule/index'),
	course:   _require('/routes/course/index'),
	courses:  _require('/routes/courses/index'),
	review:   _require('/routes/review/index'),
	reviews:  _require('/routes/reviews/index')
}

//ejs存取session
app.use(function(req, res, next){
  res.locals.session = req.session;
  next();
});

//首頁以及其他第一階層的功能
app.use('/', Route.index);

//會員功能
app.use('/user', Route.user);
app.use('/users', Route.users);

//課表
app.use('/schedule', Route.schedule);

//課程
app.use('/course', Route.course);
app.use('/courses', Route.courses);

//評價
app.use('/review', Route.review);
app.use('/reviews', Route.reviews);

// ERROR HANDLER
var routerErrorHandler = function(error, req, res, next) {
	switch(error.status) {
		case 404:
			res.status(404).json({code: -99, error: '404 not found'});
			break;
		default:
			logger.error(error);
			if(req.originalMethod === 'GET') { res.status(500).send('Internal Server Error - '+error); }
			else { res.status(500).json({code: -99, error: 'internal error - '+error}); }
			break;
	}
};
app.use(routerErrorHandler);
