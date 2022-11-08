/* eslint-disable no-plusplus */
/* eslint-disable radix */

/**
 * Validate file name before get time in ISO8601 format
 * @param {string} fileName Provided file name
 * @throws {Error} If file name doesn't start with YYYY MM DD HH MM SS
 */
function validateFileName(fileName) {
  if (!fileName.charAt(0).match(/[0-9]/g)
     || !fileName.charAt(1).match(/[0-9]/g)
     || !fileName.charAt(2).match(/[0-9]/g)
     || !fileName.charAt(3).match(/[0-9]/g)
     || fileName.charAt(4).match(/[0-9]/g)
     || !fileName.charAt(5).match(/[0-9]/g)
     || !fileName.charAt(6).match(/[0-9]/g)
     || fileName.charAt(7).match(/[0-9]/g)
     || !fileName.charAt(8).match(/[0-9]/g)
     || !fileName.charAt(9).match(/[0-9]/g)
     || fileName.charAt(10).match(/[0-9]/g)
     || !fileName.charAt(11).match(/[0-9]/g)
     || !fileName.charAt(12).match(/[0-9]/g)
     || fileName.charAt(13).match(/[0-9]/g)
     || !fileName.charAt(14).match(/[0-9]/g)
     || !fileName.charAt(15).match(/[0-9]/g)
     || fileName.charAt(16).match(/[0-9]/g)
     || !fileName.charAt(17).match(/[0-9]/g)
     || !fileName.charAt(18).match(/[0-9]/g)) {
    const error = new Error("File name doesn't start with YYYY MM DD HH MM SS");
    error.status = 422;
    throw error;
  }
}

/**
 * Get time in ISO8601 format from file name
 * @param {object} file Provided CSV file
 * @returns {object} Data in JSON format
 */
function getTimeISO8601FromFileName(fileName) {
  validateFileName(fileName);

  const year = parseInt(fileName.slice(0, 4));
  const month = parseInt(fileName.slice(5, 7));
  const day = parseInt(fileName.slice(8, 10));
  const hour = parseInt(fileName.slice(11, 13));
  const minute = parseInt(fileName.slice(14, 16));
  const second = parseInt(fileName.slice(17));

  const date = new Date(year, month, day, hour, minute, second);
  return date.toISOString();
}

/**
 * Get object from CSV array
 * @param {object} csvArray Provided CSV array
 * @returns {object} object
 */
async function getObjectFromCsvArray(csvArray) {
  return new Promise((resolve, reject) => {
    try {
      const objectArray = [];
      const columns = csvArray[0];

      for (let i = 1; i < csvArray.length; i++) {
        const object = {};

        for (let k = 0; k < csvArray[i].length; k++) {
          object[columns[k]] = csvArray[i][k];
        }
        objectArray.push(object);
      }

      resolve(objectArray);
    } catch (error) {
      error.status = 422;
      reject(error);
    }
  });
}

/**
 * Process CSV file and return in JSON format
 * {
 *  id: <<filename>>,
 *  received: <<timestamp ISO8601 format>>,
 *  payload: {
 *      <<key - values>>
 *  }
 * }
 * @param {string} fileName Provided file name
 * @param {array} csvArray Provided CSV array
 * @returns {object} Data in JSON format
 */
async function processCsv(fileName, csvArray) {
  return {
    id: fileName,
    received: getTimeISO8601FromFileName(fileName),
    payload: await getObjectFromCsvArray(csvArray),
  };
}

module.exports = {
  processCsv,
};
