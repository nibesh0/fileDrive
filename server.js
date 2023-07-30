const express = require('express');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 3000;


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(session({ secret: 'mysecretkey', resave: false, saveUninitialized: true }));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const file = req.files.file;
  const fileName = file.name;
  const fileSize = file.data.length;
  const uploadPath = path.join(__dirname, 'uploads', fileName);


  file.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    console.log(`File uploaded: ${fileName}, size: ${fileSize} bytes`);
    res.send('File uploaded successfully!');
  });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
