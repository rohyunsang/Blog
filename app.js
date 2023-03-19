const port = process.env.PORT || 3000;
const http = require('http');
const fs = require('fs');
const formidable = require('formidable');
const AWS = require('aws-sdk');
const html = fs.readFileSync('index.html');

const log = function(entry) {
    fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
};

// AWS credentials
AWS.config.update({
  accessKeyId: 'YOUR_ACCESS_KEY_ID',
  secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
  region: 'ap-northeast-2'
});

const s3 = new AWS.S3();

const uploadFile = function(file) {
  const fileContent = fs.readFileSync(file.path);
  const params = {
    Bucket: 'YOUR_BUCKET_NAME',
    Key: file.name,
    Body: fileContent
  };
  s3.upload(params, function(err, data) {
    if (err) {
      console.log("Error uploading file: ", err);
    } else {
      console.log("File uploaded successfully. Location:", data.Location);
    }
  });
};

const server = http.createServer(function (req, res) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
      if (err) {
        console.error('Error parsing form data', err);
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Internal server error');
        return;
      }

      // Handle file upload
      if (files.upload) {
        console.log('File uploaded:', files.upload.name);
        uploadFile(files.upload);
      }

      res.writeHead(200, 'OK', {'Content-Type': 'text/plain'});
      res.end();
    });
  } else {
    res.writeHead(200);
    res.write(html);
    res.end();
  }
});

// Listen on port 3000, IP defaults to 127.0.0.1
server.listen(port);

// Put a friendly message on the terminal