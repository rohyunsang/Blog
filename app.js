const express = require('express');
const app = express();
const fs = require('fs');

app.use(express.static('public'));

const port = process.env.PORT || 3000;

const log = (entry) => {
    fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
};

app.post('/', (req, res) => {
    let body = '';

    req.on('data', (chunk) => {
        body += chunk;
    });

    req.on('end', () => {
        log('Received message: ' + body);
        res.status(200).send('OK');
    });
});

app.post('/scheduled', (req, res) => {
    log('Received task ' + req.headers['x-aws-sqsd-taskname'] + ' scheduled at ' + req.headers['x-aws-sqsd-scheduled-at']);
    res.status(200).send('OK');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/assgin', (req, res) => {
  // Render the resume page
  res.render('assgin');
}); 

app.listen(port, () => {
    console.log('Server running at http://127.0.0.1:' + port + '/');
});