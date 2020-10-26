const express = require('express')
const bodyParser = require('body-parser')
const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs')
const expressFileUpload = require('express-fileupload')
const app = express();

app.get('/', (req, res) => {
    res.sendfile(__dirname + '/index.html')
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

ffmpeg.setFfmpegPath("C:/ffmpeg/bin/ffmpeg.exe");

ffmpeg.setFfprobePath("C:/ffmpeg/bin");

ffmpeg.setFlvtoolPath("C:/flvtool");

console.log(ffmpeg)

app.post('/convert', (req, res) => {
    let to = req.body.to
    let file = req.files.file
    let fileName = `output.${to}`
    console.log(to)
    console.log(file)

    //Load file
    file.mv("tmp/" + file.name, function (err) {
        if (err) return res.sendStatus(500).send(err);
        console.log("File Uploaded successfully");
    });

    //Sua dinh dang
    ffmpeg("tmp/" + file.name)
        .withOutputFormat(to)
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
        .saveToFile(__dirname + fileName)
})


app.listen(4000, () => {
    console.log("Dung port 4000")
})