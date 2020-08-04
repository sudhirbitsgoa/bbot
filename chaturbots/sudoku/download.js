const Fs = require('fs')  
const Path = require('path')  
const Axios = require('axios')

async function downloadImage (imageUrl, userId, dir) {  
  Fs.mkdirSync(Path.resolve('/', 'usr', 'share', 'sudoku-solver', 'images', dir));
  const url = imageUrl;
  const path = Path.resolve(__dirname, dir, 'code.jpg');
  let writer;
  try {
	writer = Fs.createWriteStream(path)
  } catch (error) {
	  debugger;
  }

  const response = await Axios({
	headers: {
		'x-user-id': userId,
		'x-auth-token': 'D3fmXEvrUa5Y_ioeTVrhozJfmYYfDOsIk05HxzOAfR9'
	},
    url,
    method: 'GET',
    responseType: 'stream'
  });

  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}


module.exports = downloadImage;