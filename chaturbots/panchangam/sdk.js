var request = require('request');

var baseUrl = "http://api.vedicrishiastro.com/v1/";
var userID =  "605238";
var apiKey = "3c881da11d427de42ca53c128ad30eae";
//var baseUrl = "https://json.astrologyapi.com/v1/";


var getResponse = (resource, data, lang = 'en', callback) => {
	var url = baseUrl + resource;
	var auth = "Basic " + new Buffer(userID + ":" + apiKey).toString('base64');
	request(
		{
			url: url,
			headers: {
				"Authorization": auth,
				"Accept-Language": lang
			},
			method: "POST",
			form: data
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
		}
	)

};

var callDailyHoroscopeApi = (resource, callback) => {
	  var url = 'http://sandipbgt.com/theastrologer/api/horoscope/'+resource;
	  request(url, { json: false }, (err, res, body) => {
		  if (!err) { 
		      if(typeof callback === 'function') {
				return callback(null, body);
			  }
		  }
		  if(typeof callback === 'function') {
			return callback(err);
		  }
	  });
}

var packageHoroData = (date, month, year, hour, minute, latitude, longitude, timezone) => {
	return {
		'day': date,
		'month': month,
		'year': year,
		'hour': hour,
		'min': minute,
		'lat': latitude,
		'lon': longitude,
		'tzone': timezone
	}

};

var packageNumeroData = (date, month, year, name) => {
    return {
        'day': date,
        'month': month,
        'year': year,
        'name': name
    }
};

var matchMakingData = (m_day, m_month, m_year, m_hour, m_min, m_lat, m_lon, m_tzone, f_day, f_month, f_year, f_hour, f_min, f_lat, f_lon, f_tzone) => {
	 return {
	 	'm_day': m_day,
	 	'm_month': m_month,
	 	'm_year': m_year,
	 	'm_hour': m_hour,
	 	'm_min': m_min,
	 	'm_lat': m_lat,
	 	'm_lon': m_lon,
	 	'm_tzone': m_tzone,
	 	'f_day': f_day,
	 	'f_month': f_month,
	 	'f_year': f_year,
	 	'f_hour': f_hour,
	 	'f_min': f_min,
	 	'f_lat': f_lat,
	 	'f_lon': f_lon,
	 	'f_tzone': f_tzone
	 }
};

var packageMatchMakingData = (maleBirthData, femaleBirthData) => {
    mData = {
        'm_day': maleBirthData['date'],
        'm_month': maleBirthData['month'],
        'm_year': maleBirthData['year'],
        'm_hour': maleBirthData['hour'],
        'm_min': maleBirthData['minute'],
        'm_lat': maleBirthData['latitude'],
        'm_lon': maleBirthData['longitude'],
        'm_tzone': maleBirthData['timezone']
	};
    fData = {
        'f_day': femaleBirthData['date'],
        'f_month': femaleBirthData['month'],
        'f_year': femaleBirthData['year'],
        'f_hour': femaleBirthData['hour'],
        'f_min': femaleBirthData['minute'],
        'f_lat': femaleBirthData['latitude'],
        'f_lon': femaleBirthData['longitude'],
        'f_tzone': femaleBirthData['timezone']
    };

    return Object.assign(mData, fData);

};



var api = {
	
	call: (resource, date, month, year, hour, minute, latitude, longitude, timezone, language, callback) => {
		var data = packageHoroData(date, month, year, hour, minute, latitude, longitude, timezone);
		return getResponse(resource, data,language, callback);
	},

	numeroCall: (resource, date, month, year, name,language, callback)=> {
		var data = packageNumeroData(date, month, year, name);
		return getResponse(resource, data, language, callback);
	},

	matchMakingCall: (resource, m_day, m_month, m_year, m_hour, m_min, m_lat, m_lon, m_tzone, f_day, f_month, f_year, f_hour, f_min, f_lat, f_lon, f_tzone, language, callback)=> {
		var data = matchMakingData(m_day, m_month, m_year, m_hour, m_min, m_lat, m_lon, m_tzone, f_day, f_month, f_year, f_hour, f_min, f_lat, f_lon, f_tzone);
		return getResponse(resource, data, language, callback);
	},

	basicPanchangCall : (resource, date, month, year, latitude, longitude, timezone, language, callback) => {
           var data = {'day': date, 'month': month, 'year': year, 'lat': latitude, 'lon': longitude, 'tzone': timezone };
           return getResponse(resource, data, language, callback);
	},

	// matchMakingCall: (resource, maleBirthData, femaleBirthData, callback)=> {
	// 	var data = packageMatchMakingData(maleBirthData, femaleBirthData);
	// 	return getResponse(resource, data, callback);
	// },

	dailyHoroscopeCall: (resource,timezone,callback) => {
		//var data = {'tzone': timezone};
		//return getResponse(resource, data, callback);
		return callDailyHoroscopeApi(resource, callback);
	}

}


module.exports = api;