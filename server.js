const tus = require('tus-node-server');
const express = require('express');
const EVENTS = require('tus-node-server').EVENTS;
const uuid = require('@tofandel/uuid-base62')
const fs = require('fs');
const { UploadImage, DownloadImage } = require('./utils/s3');


const server = new tus.Server();

server.datastore = new tus.FileStore({
    path: '/images',
    namingFunction: () => uuid.v4()
});


const app = express();

//tus server config
const uploadApp = express();
uploadApp.all('*', server.handle.bind(server));
app.use('/uploads', uploadApp);

server.on(EVENTS.EVENT_UPLOAD_COMPLETE, async (event) => {
    const filepath = __dirname + `\\images\\${event.file.id}`
    const filename = event.file.id
    const result = await UploadImage(filename, filepath)
    console.log(result)
});

//ejs config
app.set('view engine', 'ejs')
//static file
app.use('/static', express.static('public'))

app.get('/', (req, res) => { res.render('index', { title: 'tus file uploader' }) })

app.get('/image/:key', async (req, res) => {
    const { key } = req.params;
    const readstream = DownloadImage(key)
    readstream.pipe(res)
})

const host = '127.0.0.1';
const port = 3000;
app.listen(port, host, () => { console.log('server is running...') });
