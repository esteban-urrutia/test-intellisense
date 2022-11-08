const fs = require('fs');
const multer = require('multer');
const express = require('express');

const upload = multer({ dest: 'tempFiles/csv/' });
const CSV = require('fast-csv');

const { Router } = express;
const { processCsv } = require('../controllers/processCsv');

/**
 * Route /ftp to upload a CSV file to be processed and returned in JSON format
 * @param {object} file Provided CSV file
 * @returns {object} Data in JSON format
 */
const ftp = new Router();
ftp.post('/ftp', upload.single('file'), (req, res) => {
  const csvArray = [];

  // open uploaded file
  CSV.parseFile(req.file.path)
    .on('data', (data) => {
      csvArray.push(data); // push each row
    })
    .on('end', async () => {
      fs.unlinkSync(req.file.path); // remove temporal file

      // process "csvArray" and respond
      try {
        const response = await processCsv(req.file.originalname, csvArray);
        res.json(response);
      } catch (error) {
        res.status(error.status);
        res.send({ message: error.message });
      }
    });
});

module.exports = {
  ftp,
};
