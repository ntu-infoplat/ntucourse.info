var routes = _require('/routes');
var config  = _require('/config.json');
var logger = require('log4js').getLogger('routes:courses:index.js');
var router = require('express').Router();
var utils = _require('/utils');

var Route = {
	course: function(request, response, next){

	}
}

var commentRoute = {
	create: function(request, response, next){

	},
	edit: function(request, response, next){

	},
	remove: function(request, response, next){

	},
	like: function(request, response, next){

	},
	dislike: function(request, response, next){

	}

}

router.route('/:courseId').get(Route.course);
router.route('/:courseId/comment/new').post(commentRoute.create);
router.route('/:courseId/comment/:commentId/edit').post(commentRoute.edit);
router.route('/:courseId/comment/:commentId/delete').post(commentRoute.remove);
router.route('/:courseId/comment/:commentId/like').get(commentRoute.like);
router.route('/:courseId/comment/:commentId/dislike').get(commentRoute.dislike);

module.exports = router;
