const Fs = require('fs')  
const Path = require('path')  
const Axios = require('axios')

async function downloadImage (imageUrl, userId, dir, token) { 
	// dir = 'temp'
	try {
		// Fs.mkdirSync(Path.resolve('/', 'home', 'sudhir', 'ChaturAI', 'sudoku-solver','images', dir));
	} catch (error) {
		debugger;		
	}
  Fs.mkdirSync(Path.resolve('/', 'usr', 'share', 'sudoku-solver', 'images', dir));
  const url = imageUrl ||  'http://0.0.0.0:3000/file-upload/X2gwSt2H8thL37CDX/image.jpeg';
  // userId = 'TPiEHXjrWZz34HL4d';
  // token = 'zVnjiIgVc4KQrpN-AhwmK2GDsF1FrmKGz_LqWrbqSE7';
  // const path = Path.resolve('/', 'home', 'sudhir', 'ChaturAI', 'sudoku-solver','images', dir, 'input.jpg');
  const path = Path.resolve('/', 'usr', 'share', 'sudoku-solver', 'images', dir, 'input.jpg');
  let writer;
  try {
	writer = Fs.createWriteStream(path)
  } catch (error) {
	  debugger;
  }

  const response = await Axios({
	headers: {
		'Cookie': `rc_token=${token}; rc_uid=${userId}`,
		'x-user-id': userId,
		'x-auth-token': token
	},
    url,
    method: 'GET',
    responseType: 'stream'
  });

  try {
	response.data.pipe(writer)
  } catch (error) {
	debugger	  
  }

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', (err) => {
		console.log('the rejection', err);
		reject();
	});
  });
}

// downloadImage()
module.exports = downloadImage;