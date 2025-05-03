const express = require('express');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const app = express();

app.use(cors());
app.use(express.json());

app.use(mongoSanitize());

// Data sanitization
app.use(xss());

module.exports = app;