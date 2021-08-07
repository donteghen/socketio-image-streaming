
var express = require('express'),
    app = express(),
    http = require('http'),
    socketIO = require('socket.io'),
    fs = require('fs'),
    path = require('path'),
    server, io, port = process.env.PORT || 8080;

    app.use(express.static(path.join(__dirname, 'public')))
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

server = http.Server(app);
server.listen(port);

io = socketIO(server);

io.on('connection', function (socket) {
    
    socket.on('upload-image', ({name, data}) => {
        const writer = fs.createWriteStream(path.join(__dirname, `public/temp/${name}`),{
            encoding : 'base64'
        })
        writer.write(data)
        writer.end()
        writer.on('finish', function(){
            //socket.emit('image-uploaded', {path : `/temp/${name}`})
            let uploadreadstream = fs.createReadStream(path.join(__dirname, `public/temp/${name}`), {
                encoding : 'binary'
            })
            let chunks = []
            uploadreadstream.on('readable', () => {
                uploadreadstream.read()
            })
            uploadreadstream.on('data', (chunk) => {
                chunks.push(chunk)
                
            })
            uploadreadstream.on('end', () => {
                setTimeout(() => {
                    socket.emit('image-uploaded', chunks); 
                }, 2000)
                console.log('upload Completed')
            })
        })
    })

    var readStream = fs.createReadStream(path.join(__dirname, 'woodchuck.jpg'), {
        encoding: 'binary'
    }), chunks = [];

    readStream.on('readable', function () {
        readStream.read()
    });

    readStream.on('data', function (chunk) {
        
        chunks.push(chunk);
        // setTimeout(() => {
        //     socket.emit('img-chunk', chunks);
        // }, 2000)
    });

    readStream.on('end', function () {
        //console.log('Image loaded');
        setTimeout(() => {
            socket.emit('img-chunk', chunks);
        }, 2000)
    });
});
