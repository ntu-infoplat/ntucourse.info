var crypto = require('crypto');
var db = _require('/service/db');
var logger = require('log4js').getLogger('models:reviewComment.js');
var api = _require('/service/api');
var sequelize = db.sequelize;
var pg_escape = require('pg-escape');
var moment = require('moment');

var ReviewComment = db.ReviewComment;

var Model = {

	create: function(params, callback){

		//建立
		var comment = ReviewComment.build(params);

		comment.save().then(function(result){

			callback(null, result);
		}).catch(function(err){
			callback(err, null);
		});
	},

	get: function(id, callback){

		ReviewComment.findOne({
			where:{
				id: id
			}
		}).then(function(comment){
			callback(null, comment);
			
		}).catch(function(err){

			//只傳回message
			callback(err.message, null);
		});
	},

	getByReviewId: function(reviewId, callback){
		//createdAt, nickname, content
		sequelize.query(
			'SELECT '+
				'A.*, B.nickname '+
			'FROM '+
				'"reviewComments" as A, users as B '+
			'WHERE '+ 
				'A."reviewId" = '+pg_escape("%L",reviewId)+' and '+
				'A."authorId" = B.fbid '+
			'order by '+
				'A."createdAt" ASC ')
		  .then(function(result) {
		  	var ret = result[0];
		  	for(var i=0;i<ret.length;i++){
		  		ret[i].createdAt = moment(ret[i].createdAt).format('YYYY-MM-DD HH:mm:ss');
		  	}
		    callback(null, ret);
		 }).catch(function(err){

			//只傳回message
			callback(err.message, null);
		});	

	}
}


module.exports = Model;