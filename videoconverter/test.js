const ffmpeg = require('ffmpeg');
const express = require('express')
const bodyParser = require('body-parser')

const fs = require('fs')
const expressFileUpload = require('express-fileupload')
const app = express();

app.get('/', (req, res) => {
	res.sendfile(__dirname + '/test.html')
})

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(
	expressFileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp/",
	})
);

app.post('/convert', (req, res) => {
    let frame = req.body.frame
    let file = req.files.file
    //let fileName = `output.${to}`
    console.log(frame)
    console.log(file)

    //Load file
    file.mv("tmp/" + file.name, function (err) {
        if (err) return res.sendStatus(500).send(err);
        console.log("File Uploaded successfully");
		try {
			var process = new ffmpeg("tmp/" + file.name);
			process.then(function (video) {
				// Callback mode
				video.fnExtractFrameToJPG("tmp/", {
					frame_rate: frame,
					number: 999,
					file_name: 'my_frame_%t_%s',
				}, function (error, files) {
					if (!error)
							console.log('Frames: ' + files);
                        res.download(__dirname + files, function (err) {
                            if (err) throw err;

                            fs.unlink(__dirname + files, function (err) {
                                if (err) throw err;
                                console.log("File deleted");
                            });
                        });
                        fs.unlink("tmp/" + file.name, function (err) {
                            if (err) throw err;
                            console.log("File deleted");
                        });
                        
				});
                
			}, function (err) {
				console.log('Error: ' + err);
			});
		} catch (e) {
			console.log(e.code);
			console.log(e.msg);
		}
    });

    //Sua dinh dang
	
    /*ffmpeg("tmp/" + file.name)
        .frames(240)
        //.withOutputFormat(to)
        .on('end', function (stdout, stderr) {
            console.log("Hoan thanh")
            res.download(__dirname + fileName, function (err) {
                if (err) throw err;

                fs.unlink(__dirname + fileName, function (err) {
                    if (err) throw err;
                    console.log("File deleted");
                });
            });
            fs.unlink("tmp/" + file.name, function (err) {
                if (err) throw err;
                console.log("File deleted");
            });
        })
        .on('error', function (err) {
            console.log("Xay ra loi")
            fs.unlink("tmp/" + file.name, function (err) {
                if (err) throw err;
                console.log("File deleted");
            });
        })
        .saveToFile(__dirname + fileName)*/
})

/*try {
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
}*/



app.listen(5000, () => {
	console.log("Dung port 5000")
})