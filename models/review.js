var crypto = require('crypto');
var db = _require('/service/db');
var logger = require('log4js').getLogger('models:review.js');
var api = _require('/service/api');
var sequelize = db.sequelize;
var pg_escape = require('pg-escape');

//get User modal
var Review = db.Review;

var ITEM_PER_PAGE = 15;

var Model = {
	search: function(keyword, page, callback){
		var offset = (page-1)*ITEM_PER_PAGE;

		sequelize.query(
			'SELECT '+
				'A.*, case A."privateConfig" when '+"'PRIVATE'"+' then '+"'匿名'"+' else B.nickname end as nickname '+
			'FROM '+
				'reviews as A, users as B '+
			'WHERE '+ 
				'A."authorId" = B.fbid and '+
				'(A."courseName" || A."teacherName") like '+pg_escape("'%%%s%%'",keyword)+' '+
			'order by '+
				'A."createdAt" DESC '+
			'limit '+ITEM_PER_PAGE +
			' offset '+offset)
		  .then(function(result) {
		    result.rows = result[0];
		    result.count = result[0].length;
		    result.page = Math.ceil((result.count/ITEM_PER_PAGE));
		    callback(null, result);
		 }).catch(function(err){

			//只傳回message
			callback(err.message, null);
		});	
	},

	create: function(params, callback){

		//建立
		var review = Review.build(params);

		review.save().then(function(result){

			callback(null, result.get('id'));
		}).catch(function(err){
			callback(err, null);
		});
	},

	get: function(id, callback){

		Review.findOne({
			where:{
				id: id
			}
		}).then(function(review){
			callback(null, review);
			
		}).catch(function(err){

			//只傳回message
			callback(err.message, null);
		});
	},

	getByUser: function(fbid, isSelf, callback){

		var params = {};
		if(isSelf){
			params = {
				where:{
					authorId: fbid
				}
			};
		}else{
			params = {
				where:{
					authorId: fbid,
					privateConfig: 'NICKNAME'
				}
			};
		}

		Review.findAll(params).then(function(review){
			callback(null, review);
			
		}).catch(function(err){

			//只傳回message
			callback(err.message, null);
		});	
	},

	getRandom: function(num, callback){

		sequelize.query(
			'SELECT A.*, case A."privateConfig" when '+"'PRIVATE'"+' then '+"'匿名'"+' else B.nickname end as nickname '+
			' FROM reviews as A, users as B where A."authorId" = B.fbid order by random() limit '+num)
		  .then(function(reviews) {
		    //logger.debug(reviews[0]);
		    callback(null, reviews[0]);
		 }).catch(function(err){

			//只傳回message
			callback(err.message, null);
		});	

		 /*
		Review.findAll({
			order:[
				sequelize.fn('random')
			],
			limit: num
		}).then(function(reviews){
			callback(null, reviews);
			
		}).catch(function(err){

			//只傳回message
			callback(err.message, null);
		});	
		*/
	}

}


module.exports = Model;