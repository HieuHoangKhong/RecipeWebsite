const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

const app = express();
const port = 4000;

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/imgs/'); // Where images will be stored
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName); // Rename to avoid filename collisions
  }
});
const upload = multer({ storage });

// Serve uploaded images statically
app.use('/imgs', express.static(path.join(__dirname, 'src', 'imgs')));

// Middleware
app.use(cors());
app.use(express.json());

// Mount routes
const recipeRoutes = require('./src/app/routes/api/recipeRoutes');
app.use('/api/recipes', recipeRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
