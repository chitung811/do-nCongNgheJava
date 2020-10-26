var ffmpeg = require('ffmpeg');
const express = require('express')
const app = express();


try {
	var process = new ffmpeg('../../../../../ffmpeg/bin/test.mp4');
	process.then(function (video) {
		// Callback mode
		video.fnExtractFrameToJPG('../../../../../ffmpeg/bin', {
			frame_rate: 1,
			number: 5,
			file_name: 'my_frame_%t_%s'
		}, function (error, files) {
			if (!error)
				console.log('Frames: ' + files);
		});
	}, function (err) {
		console.log('Error: ' + err);
	});
} catch (e) {
	console.log(e.code);
	console.log(e.msg);
}



app.listen(5000, () => {
	console.log("Dung port 5000")
})