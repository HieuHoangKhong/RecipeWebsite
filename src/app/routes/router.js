const express = require('express');
const router = express.Router();

const recipeRoutes = require('./api/recipeRoutes');
router.use('/recipes', recipeRoutes);

module.exports = router;