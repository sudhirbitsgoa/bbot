// http://localhost:3000/api/v1/rooms.upload/TPiEHXjrWZz34HL4dxY5aSnbkd4xdqg22H
const axios = require('axios');
const FormData = require('form-data');
const Path = require('path');
const fs = require('fs');

async function uploadFile(userId, roomId, dir, filename) {
	const formData = new FormData();
	const path = Path.resolve('/', 'usr', 'share', 'sudoku-solver', 'images', dir, 'solved_input.jpg');
	formData.append('file', fs.createReadStream(path), 'solved_input.jpg');
	const request_config = {
		headers: {
			...formData.getHeaders(),
			'x-user-id': userId,
			'x-auth-token': 'D3fmXEvrUa5Y_ioeTVrhozJfmYYfDOsIk05HxzOAfR9'
		},
		method: 'POST',
		url: `http://localhost:3000/api/v1/rooms.upload/${roomId}`,
		data: formData
	};
	try {
		await axios(request_config);
	} catch (error) {
		debugger;
		console.log('the error', error);
	}
}

module.exports = uploadFile;