var logger = require('log4js').getLogger('models:pttReview.js');

var db = _require('/service/db');
var sequelize = db.sequelize;

//get modal
var PttReview = db.PttReview;

var ITEM_PER_PAGE = 15;

var Model = {
	search: function(keyword, page, callback){

		var offset = (page-1)*ITEM_PER_PAGE;
		PttReview.findAndCountAll({
			where:{
				title: {
					$like: '%'+keyword+'%'
				} 
			},
			order:[
				['time', 'DESC'],
			],
			offset: offset,
			limit: ITEM_PER_PAGE
		}).then(function(result){
			result.page = Math.ceil((result.count/ITEM_PER_PAGE));
			callback(null, result);
		}).catch(function(err){
			callback(err, null)
		});
	},

	get: function(id, callback){
		PttReview.findOne({
			where:{
				pttId: id
			}
		}).then(function(result){
			callback(null, result);
		}).catch(function(err){
			callback(err, null)
		});		
	},

	getRandom: function(callback){
		PttReview.findAll({
			order:[
				sequelize.fn('random')
			],
			limit: 1
		}).then(function(reviews){
			callback(null, reviews[0]);
			
		}).catch(function(err){

			//只傳回message
			callback(err.message, null);
		});	
	}
}


module.exports = Model;