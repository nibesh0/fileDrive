const express = require('express');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const path = require('path');
const os = require('os');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(session({ secret: 'mysecretkey', resave: false, saveUninitialized: true }));

const getLocalIpAddress = () => {
  const interfaces = os.networkInterfaces();
  for (const ifaceName of Object.keys(interfaces)) {
    const iface = interfaces[ifaceName];
    for (const ifaceDetails of iface) {
      if (ifaceDetails.family === 'IPv4' && !ifaceDetails.internal) {
        return ifaceDetails.address;
      }
    }
  }
  return 'localhost';
};

const ipAddress = getLocalIpAddress();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/upload', (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).send('No files were uploaded.');
  }

  const file = req.files.file;


  const fileName = file.name;
  const uploadPath = path.join(__dirname, 'uploads', fileName);

  file.mv(uploadPath, (err) => {
    if (err) {
      console.error('Error during file upload:', err);
      return res.status(500).send('An error occurred during file upload.');
    }

    console.log(`File uploaded: ${fileName}, size: ${file.size} bytes`);
    res.send('File uploaded successfully!');
  });
});

app.listen(PORT, ipAddress, () => {
  console.log(`Server started on http://${ipAddress}:${PORT}`);
});
