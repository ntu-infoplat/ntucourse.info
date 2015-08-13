var routes = _require('/routes');
var config  = _require('/config.json');
var logger = require('log4js').getLogger('routes:users:index.js');
var router = require('express').Router();
var utils = _require('/utils');

var User = _require('/models/user');
var Review = _require('/models/review');

var Route = {
	user: function(request, response, next){

		var fbid = request.params.fbid;

		var isSelf = false;
		if(fbid==request.session.fbid){
			isSelf = true;
		}

		//找到這user所有文章
		Review.getByUser(fbid, isSelf, function(err, result){

			if(err){
				logger.debug(err);
				next(err);
				return;
			}

			//顯示
			response.render('users/reviews',{
				count: result.length,
				result: result
			});

		});

	}
}

router.route('/:fbid').get(Route.user);

module.exports = router;
