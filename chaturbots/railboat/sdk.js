var request = require('request');
var privateKey =  "f77d29b863dddf46102d959dd450f149";
var apiKey = "b663ec0300fda7fcc7b25f5170ff751a";
var getResponse = ( pnrnumber, callback) => {
    var url = `https://indianrailapi.com/api/v2/PNRCheck/apikey/${apiKey}/PNRNumber/${pnrnumber}/Route/1/`;
	request(
		{
			url: url,
			method: "GET"
		},
		function(err, res, body) {
			if(!err) {
				if(typeof callback === 'function') {
					return callback(null, body);
				}
			}
			if(typeof callback === 'function') {
				return callback(err);
			}
			console.log('callback not provided properly');
		}
	)
};

var api = {
	call: ( pnrnumber , callback ) => {
		return getResponse( pnrnumber, callback);
	}
}
module.exports = api;
