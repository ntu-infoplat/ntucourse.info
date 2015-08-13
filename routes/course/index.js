var routes = _require('/routes');
var config  = _require('/config.json');
var logger = require('log4js').getLogger('routes:course:index.js');
var router = require('express').Router();
var utils = _require('/utils');
var escape = require('escape-html');

var Review = _require('/models/review');
var PttReview = _require('/models/pttReview');

var Route = {
	search: function(request, response, next){

		var name = request.query.name;
		var page = request.query['page'];
		var type = request.query['type'];
		if(typeof page==='undefined' || !page){
			page = 1;
		}

		if(typeof type==='undefined' || !type){
			type = 'long';
		}

		if(type==='long'){
			//搜尋
			PttReview.search(name, page, function(err, result){
				if(err){
					logger.debug(err);
					next();
				}else{
					response.render('course/search',{
						href: '/course/search?name='+encodeURIComponent(name)+"&page=",
						result: result.rows,
						count: result.count,
						lastPage: result.page,
						nowPage: parseInt(page,10)
					});
				}
			})
		}else{

			//短評
			Review.search(name, page, function(err, result){
				if(err){
					logger.debug(err);
					next();
				}else{

					if(result.rows){
						result.rows = result.rows.map(function(item){
							item.content = utils.nl2br(escape(item.content));
							return item;
						});
					}
					response.render('course/search_short',{
						href: '/course/search?type=short&name='+encodeURIComponent(name)+"&page=",
						longHref: '/course/search?type=long&name='+encodeURIComponent(name)+"&page=1",
						reviews: result.rows,
						count: result.count,
						lastPage: result.page,
						nowPage: parseInt(page,10)
					});
				}
			})
		}

		
	},

	tag: function(request, response, next){

	},

	teacher: function(request, response, next){

	}
}

router.route('/search').get(Route.search);
router.route('/tag/:tag').get(Route.tag);
router.route('/teacher/:name').get(Route.teacher);

module.exports = router;
