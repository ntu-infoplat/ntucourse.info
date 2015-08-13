var routes = _require('/routes');
var config  = _require('/config.json');
var logger = require('log4js').getLogger('routes:reviews:index.js');
var router = require('express').Router();
var utils = _require('/utils');
var escape = require('escape-html');
var moment = require('moment');

var PttReview = _require('/models/pttReview');
var Review = _require('/models/review');
var ReviewComment = _require('/models/reviewComment');
var User = _require('/models/user');

var Route = {

	//單篇
	review: function(request, response, next){

		var reviewId = request.params.reviewId;

		//先撈留言
		ReviewComment.getByReviewId(reviewId, function(err, comments){

			if(err){
				comments = [];
			}

			for(var i=0;i<comments.length;i++){
				comments[i].content = nl2br(escape(comments[i].content));
			}

			//先看看是哪個
			if(reviewId.indexOf('.')>-1){

				//ptt
				PttReview.get(reviewId, function(err, item){
					if(err){
						logger.debug(err);
						next();
						return;
					}

					//把第一行做轉換
					var origin = item.content;
					var after = origin.split('\n');
					after[0] = '';
					item.content = after.join('\n');

					response.render('reviews/index',{
						id: reviewId,
						title: item.title,
						author: item.author,
						time: item.time,
						content: nl2br(escape(item.content)),
						comments: comments
					});
				});
			}else{

				//自己
				Review.get(reviewId, function(err, item){
					if(err){
						logger.debug(err);
						next();
						return;
					}

					if(item.privateConfig==="PRIVATE"){
						response.render('reviews/index',{
							id: reviewId,
							title: item.title,
							author: '匿名',
							time: item.parseTime,
							content: nl2br(escape(item.content)),
							comments: comments
						});
					}else{

						//抓作者名稱
						User.get(item.authorId, function(err, result){
							if(err){
								logger.debug(err);
								next(err);
							}else{
								response.render('reviews/index',{
									id: reviewId,
									title: item.title,
									author: result.nickname,
									time: item.parseTime,
									content: nl2br(escape(item.content)),
									comments: comments
								});
							}
						});
					}
				});
			}	
		});

		
	},

	edit: function(request, response, next){

	},

	remove: function(request, response, next){

		//刪除
		//先確認是不是自己的
		if(typeof request.session.fbid==='undefined'){
			response.redirect('/');
			return;
		}

		var fbid = request.session.fbid;
		if(!fbid){
			response.redirect('/');
			return;
		}

		var reviewId = request.params.reviewId;
		Review.get(reviewId, function(err, item){
			if(err){
				logger.debug(err);
				next();
				return;
			}

			if(item.authorId!==fbid){
				response.redirect('/');
				return;
			}

			//刪除
			item.destroy().then(function(){
				response.redirect('/users/'+fbid);
			});
		});
	},

	like: function(request, response, next){

	},

	dislike: function(request, response, next){

	}
}

var commentRoute = {
	create: function(request, response, next){
		var content = request.body.content;
		var reviewId = request.params.reviewId;
		var fbid = request.session.fbid;

		var ret = {
			msg:''
		};

		if(!fbid){
			ret.msg = 'NOT_LOGIN';
			response.send(JSON.stringify(ret));
			return;
		}

		if(!content || content==''){
			ret.msg = 'EMPTY';
			response.send(JSON.stringify(ret));
			return;
		}

		var params = {
			reviewId: reviewId,
			authorId: fbid,
			content: content
		};

		ReviewComment.create(params, function(err, result){

			if(err){
				ret.msg = 'ERROR';
				response.send(JSON.stringify(ret));
			}else{
				ret.msg = 'OK';
				ret.name = request.session.nickname;
				ret.time = moment(result.createdAt).format('YYYY-MM-DD HH:mm:ss');
				response.send(JSON.stringify(ret));
			}
		});

	},
	edit: function(request, response, next){

	},
	remove: function(request, response, next){
		var reviewId = request.params.reviewId;
		var commentId = request.params.commentId;

		//先確認是不是自己的
		ReviewComment.get(commentId, function(err, result){
			if(err || result.authorId!==request.session.fbid){
				logger.debug(err);
				request.session.notice = "刪除留言錯誤！";
				response.redirect('/reviews/'+reviewId);
			}else{
				request.session.success = "刪除留言成功！";
				result.destroy().then(function(){
					response.redirect('/reviews/'+reviewId);
				});
			}
		})

	},
	like: function(request, response, next){

	},
	dislike: function(request, response, next){

	}

}

function nl2br (str, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

router.route('/:reviewId').get(Route.review);
router.route('/:reviewId/edit').post(Route.edit);
router.route('/:reviewId/delete').get(Route.remove);
router.route('/:reviewId/like').get(Route.like);
router.route('/:reviewId/dislike').get(Route.dislike);

router.route('/:reviewId/comment/new').post(commentRoute.create);
router.route('/:reviewId/comment/:commentId/edit').post(commentRoute.edit);
router.route('/:reviewId/comment/:commentId/delete').get(commentRoute.remove);
router.route('/:reviewId/comment/:commentId/like').get(commentRoute.like);
router.route('/:reviewId/comment/:commentId/dislike').get(commentRoute.dislike);

module.exports = router;
