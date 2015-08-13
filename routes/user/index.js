var routes = _require('/routes');
var config  = _require('/config.json');
var logger = require('log4js').getLogger('routes:user:index.js');
var router = require('express').Router();
var crypto = require('crypto');
var utils = _require('/utils');
var User = _require('/models/user');

var salt = config.salt;
var login_course = "https://ntu-junior.herokuapp.com/login_course";

var Route = {
	index: function(request, response, next){

	},

	loginPage: function(request, response, next){

		//TODO: 登入頁面
		//response.render('login');
		request.session.action = 'login';
		response.redirect(login_course);
	},

	//deprecated
	login: function(request, response, next){

		var username = request.body.username;
		var password = request.body.password;

		//登入
		User.login(username+"@ntu.edu.tw", password, function(err, result){
			if(err){
				request.session.notice = err;
				response.redirect('/user/login');
			}else{
				request.session.username = username;
				request.session.uid = result;
				response.redirect('/');
			}
		})
		
	},

	logout: function(request, response, next){
		request.session = {};
		response.redirect('/');
	},

	registerPage: function(request, response, next){
		request.session.action = 'register';
		response.redirect(login_course);
		//response.render('register');
	},

	registers: function(request, response, next){
		response.render('register');
	},

	register: function(request, response, next){

		//學號
		var email = request.body.email;
		var nickname = request.body.nickname;

		var needAuth = true;

		//學號一樣的話，直接通過
		if(email===request.session.sid){
			needAuth = false;
		}

		//新增
		//fbid, 學號, fbname, nickname, needAuth
		User.register(
			request.session.pre_fbid, 
			email,
			request.session.name,
			nickname,
			needAuth, 
			function(err, result){
				if(err){
					logger.debug(err);
					request.session.notice = "發生錯誤！可能是資料有誤或是此學號已註冊過";
					response.redirect('/user/registers');

				}else{
					if(needAuth){
						request.session.success = '註冊成功！請至信箱收取驗證信以開通帳號';
					}else{
						request.session.success = '註冊成功！因為你之前已經使用過我們的服務（找新生直屬），所以無需驗證信箱囉';

						//直接讓他登入
						request.session.fbid = request.session.pre_fbid;
						request.session.nickname = nickname;
					}
					response.redirect('/');
					//response.render('register_done');
				}
			}
		);
	},

	profile: function(request, response, next){

	},

	//callback
	callback: function(request, response, next){
		var code = request.params.code;
		var result = JSON.parse(decodeURIComponent(code));
		var data = result.data;
		var key = result.key;
		var sign = result.signature;

		//驗證
		if(crypto.createHash('sha256').update(JSON.stringify(data)+key+salt).digest('hex') === sign){

			//看是要登入還是要註冊
			if(request.session.action==='login'){

				//登入
				User.login(data.id, function(err, result){
					if(err){

						request.session.notice = err;
						response.redirect('/');
					}else{
						request.session.fbid = data.id;
						request.session.nickname = result.nickname;
						response.redirect('/');
					}
				})

			}else{

				//註冊
				request.session.pre_fbid = data.id;
				request.session.name = data.name;
				request.session.sid = data.sid || '';

				//繼續讓他完成註冊流程
				response.redirect('/user/registers')
			}
		}else{
			response.send('Error! please contact: aszx87410@gmail.com for more detail.');
		}
	},

	//驗證
	verify: function(request, response, next){
	  User.verify(request.params.code, function(err, result){
	  	if(err){
	  		request.session.notice = '驗證錯誤';
	  		response.redirect('/');
	  	}else{
	  		response.render('template',{
	  			text: "驗證信箱成功！請按右上角按鈕登入"
	  		});
	  	}
	  });
	}
}

router.route('/').get(Route.index);
router.route('/login').get(Route.loginPage);
router.route('/login').post(Route.login);
router.route('/logout').get(Route.logout);
router.route('/register').get(Route.registerPage);
router.route('/register').post(Route.register);
router.route('/registers').get(Route.registers);
router.route('/profile').get(Route.profile);
router.route('/callback/:code').get(Route.callback);
router.route('/verify/:code').get(Route.verify);


module.exports = router;
