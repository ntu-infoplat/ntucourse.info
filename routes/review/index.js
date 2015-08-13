var routes = _require('/routes');
var config  = _require('/config.json');
var logger = require('log4js').getLogger('routes:review:index.js');
var router = require('express').Router();
var utils = _require('/utils');

var Review = _require('/models/review');

var Route = {

	//新增
	create: function(request, response, next){

		var fbid = request.session.fbid;
		if(!fbid){
			next(new Error('error'));
			return;
		}

		var courseName = request.body.name;
		var teacher = request.body.teacher;
		var semester = request.body.semi;
		var content = request.body.content;
		var privateConfig = request.body.privateConfig;

		Review.create({
			authorId: fbid,
			courseName: courseName,
			teacherName: teacher,
			semester: semester,
			content: content,
			privateConfig: privateConfig
		},function(err, result){
			if(err){
				logger.debug(err);
				next(err);
			}else{

				//成功
				response.redirect('/reviews/'+result);
			}
		});
	}
}

router.route('/new').post(Route.create);
module.exports = router;
