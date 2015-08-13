var async = require('async');
var request = require('request');
var querystring = require('querystring');
var sys = require('sys')
var logger = require('log4js').getLogger('service:api.js');
var utils = _require('/utils');
var config = _require('/config.json');
var mailgun = require('mailgun-js')({
  apiKey: config.mailgun.key,
  domain: config.mailgun.domain
});

var API = {

	/**
	 * 搜尋課程
	 */
	searchCourse: function(params, callback){
		

	},

	sendAuthMail: function(recipient, code, callback){

    var data = {
      from: 'NTUCourse <service@' + config.mailgun.domain + '>',
      to: recipient,
      subject: 'NTUcourse.info 驗證信',
      html: 'Hi,<br><br>感謝你使用ntucourse.info，請點選以下連結以確認你的帳號<br><a href="http://ntucourse.info/user/verify/'+code+'">' + '請點此驗證信箱' + '</a><br><br>如果你沒有註冊，請忽略此信'
    };

    mailgun.messages().send(data, function(err, body) {
      if(err){
          logger.debug(err);
          callback(err, null);
        }else{
          callback(null, null);
        }
    });
	},

  sendMail: function(sender, content, callback){

    var data = {
      from: sender,
      to: 'aszx87410@gmail.com',
      subject: 'NTUcourse.info 意見回報',
      html: content
    };

    mailgun.messages().send(data, function(err, body) {
      if(err){
          logger.debug(err);
          callback(err, null);
        }else{
          callback(null, null);
        }
    });
  }
}

module.exports = API;