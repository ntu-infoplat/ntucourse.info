var config  = _require('/config.json');
var utils = _require('/utils');

var logger = require('log4js').getLogger('ntucourse:routes:index.js');
var router = require('express').Router();
var async = require('async');
var escape = require('escape-html');
var api = _require('/service/api');

var Review = _require('/models/review');
var PttReview = _require('/models/pttReview');

//首頁
var Route = {
	index: function(request, response, next){

		//寫cookie
		var isIntro = false;
		if(!request.cookies.intro){
			isIntro = true;
			response.cookie('intro', '1', { maxAge: 1000*60*60*24*365 });
		}
		
		PttReview.getRandom(function(err, pttResult){

			pttResult.content = utils.nl2br(escape(pttResult.content));
			Review.getRandom(3, function(err, result){
				if(err || !result){
					result = [];
				}
				result = result.map(function(item){
					item.content = utils.nl2br(escape(item.content));
					return item;
				});
				response.render('index',{
					reviews: result,
					pttReview: pttResult,
					isIntro: isIntro
				});	
			})
		});

	},

	help: function(request, response, next){

	},

	report: function(request, response, next){
		var email = request.body.email;
		var content = request.body.content;

		api.sendMail(email, content, function(err, result){
			if(err){
				logger.debug(err);
				response.send('ERROR');
			}else{
				response.send('OK');
			}
		});


	},

	about: function(request, response, next){
		
	}
}

//其餘功能
router.route('/').get(Route.index);
router.route('/help').get(Route.help);
router.route('/report').post(Route.report);
router.route('/about').get(Route.about);

module.exports = router;
