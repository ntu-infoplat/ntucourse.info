var routes = _require('/routes');
var config  = _require('/config.json');
var logger = require('log4js').getLogger('routes:schedule:index.js');
var router = require('express').Router();
var utils = _require('/utils');

var Route = {

	//我的課表
	index: function(request, response, next){

	},

	save: function(request, response, next){

	},

	newCourse: function(request, response, next){

	},

	deleteCourse: function(request, response, next){

	}
}

router.route('/').get(Route.index);
router.route('/save').get(Route.save);
router.route('/:courseId/new').get(Route.newCourse);
router.route('/:courseId/delete').get(Route.deleteCourse);

module.exports = router;
