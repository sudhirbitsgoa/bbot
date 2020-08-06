const axios = require('axios');

async function login() {
	const request_config = {
		method: 'POST',
		url: `${process.env.ROCKETCHAT_URL}/api/v1/login`,
		data: {
			'username': process.env.ROCKETCHAT_USER,
			'password': process.env.ROCKETCHAT_PASSWORD
		}
	};
	const user = await axios(request_config);
	return {authToken, userId} = user.data.data;
}

module.exports = login;

