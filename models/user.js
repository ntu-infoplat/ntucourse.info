var crypto = require('crypto');
var db = _require('/service/db');
var logger = require('log4js').getLogger('models:user.js');
var api = _require('/service/api');

//get User modal
var User = db.User;

var UserModel = {
	login: function(fbid, callback){

		User.findOne({
			where:{
				fbid: fbid
			}
		}).then(function(user){
			//logger.debug(user);
			if(user){

				//檢查驗證
				if(user.get('is_verify')===false){
					callback('還沒通過信箱驗證！', null);
					return;
				}

				//更新時間
				user.save();

				callback(null, user);
			}else{
				callback('你好像還沒註冊喔！', '');
			}
			
		}).catch(function(err){

			//只傳回message
			callback(err.message, null);
		});
	},

	register: function(fbid, sid, fbname, nickname, needAuth, callback){

		//隨機產生key
		var code = crypto.randomBytes(32).toString('hex');

		var params = {
			fbid: fbid,
			sid: sid,
			fbname: fbname,
			nickname: nickname,
			verifyCode: code
		};

		if(!needAuth){
			params.is_verify = true;
		}

		//建立
		var user = User.build(params);

		user.save().then(function(result){

			if(needAuth){

				//寄信
				api.sendAuthMail(sid+"@ntu.edu.tw", code, function(err, result){
					callback(err, result);
				});
			}else{
				callback(null, result);
			}
		}).catch(function(err){
			callback(err, null);
		});
	},

	verify: function(code, callback){

		User.findOne({
			where:{
				verifyCode: code
			}
		}).then(function(user){
			if(user){

				//更新時間
				user.updateAttributes({
					is_verify: true
				});
				user.save();

				callback(null, user.get('fbid'));
			}else{
				callback('驗證錯誤', '');
			}
			
		}).catch(function(err){

			//只傳回message
			callback(err.message, null);
		});
	},

	get: function(fbid, callback){
		User.findOne({
			where:{
				fbid: fbid
			}
		}).then(function(user){
			callback(null, user);
		}).catch(function(err){
			callback(err, null);
		});
	}
}

module.exports = UserModel;