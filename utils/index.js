var config = require('../config.json');
var log4js = require('log4js');
var logger = log4js.getLogger('utils');
var crypto = require('crypto');
var request = require('request');
var moment = require('moment');
var fs = require("fs");
var path = require("path");
var _ = require('underscore');

var Util = {

	md5Hash : function(value) {
		var	md5 = crypto.createHash('md5');
		var hash = md5.update(value).digest('hex');
		return hash;
	},

	getParameterByName : function (data, key) {
    key = key.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + key + "=([^&#]*)"),
        results = regex.exec(data);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	},

	mask : function(str) {
		var l = str.length;
		var n = l/3;
		return str.substring(0,n)+'*'+str.substring(l-n,l);
	},

	doHttpPost : function(log, apiEndpoint, data, fn) {
		logger.debug(apiEndpoint);
		request.post({url: apiEndpoint, form: data}, 
			function(error, response, body) {
				if(config.debug) {
					logger.debug(log+'('+response.statusCode+')'+': '+body);
				}
				if(error) {
					return fn(error, null); 
				}
				return fn(null, body);
		});
	},
	
	toJSON : function(data) {
		if(typeof(data) !== 'string') return ;
		var toReturn;
		try {
			toReturn = JSON.parse(data);
		} catch(e) {
			logger.error('Error data: ', data);
			logger.error(e);
			return e;
		}
		return toReturn;
	},

	isValid: function( obj ) {
		if( _.isUndefined(obj) ) return false;
		if( _.isNull(obj) ) return false;
		if( obj.length === 0 ) return false;

		return true;
	},

	nl2br: function(str, is_xhtml) {
	    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
	    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
	}
};

module.exports = Util;