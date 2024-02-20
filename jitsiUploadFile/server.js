const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const cors = require('cors');
const path = require('path');
const app = express();
const port = 5400;

// Enable CORS for all routes or specific routes as needed
app.use(cors());

// Set up Multer to store files on disk
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    // Use the UpPath header to determine the directory where you want to save the files
    const upPath =  '/usr/share/jitsi-meet/uploads/' + req.headers.uppath + '/';
    //console.log(upPath);

    try {
      // Check if the directory exists, create it if not
      await fs.access(upPath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // Directory doesn't exist, create it
        await fs.mkdir(upPath, { recursive: true });
      } else {
        // Handle other errors
        return cb(error);
      }
    }

    cb(null, upPath);
  },
  filename: function (req, file, cb) {
    // Use the original filename for the saved file
    cb(null, file.originalname);
  },
});

// Middleware to check authorization
const checkAuthorization = (req, res, next) => {
  const authToken = req.headers.authorization;
  //console.log(authToken);
  //const upSessionPath = req.headers.uppath;
  //console.log(req.headers);
  
  // Check if the authorization token and UpPath header are valid
  if (authToken === 'Bearer 3991fc9776f861af6f07d9f6f805a5fef6af62c9bf051f497a98b2c64800a9bd' || req.query.session) {
    next(); // Continue with the request if authorized
  } else {
    res.status(401).send('Unauthorized'); // Respond with 401 Unauthorized if not authorized
  }
};

// New endpoint to retrieve the list of files
app.get('/files', checkAuthorization, async (req, res) => {
  const session = req.query.session;
  const filename = req.query.name;

  const filePath = '/usr/share/jitsi-meet/uploads/' + session + '/' + filename;

  // Set Content-Disposition header to specify the original filename
  res.setHeader('Content-Disposition', 'attachment; filename=' + filename);

  try {
    // Check if the file exists
    await fs.access(filePath);

    // Send the file as a response
    res.sendFile(filePath, { root: '/', filename: filename  });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving or sending the file');
  }
});


// Increase the file size limit (in bytes), adjust it according to your needs
const maxFileSize = 50 * 1024 * 1024; // 10 MB

const upload = multer({
  storage: storage,
  limits: {
    fileSize: maxFileSize,
  },
});



// Handle file uploads and save to disk
app.post('/attimoMeetUpload', checkAuthorization, upload.single('file'), (req, res) => {
  const file = req.file;

  // Check if a file was uploaded
  if (!file) {
    return res.status(400).send('No file uploaded');
  }

  // Process the file as needed (save to disk, database, etc.)
  res.send('File uploaded successfully');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
