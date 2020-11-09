// const { reject } = require("bluebird");
var fs = require('fs')
var path = require('path');


const main = (filePath) => {
    return new Promise((resolve, reject) => {
        function formatDate(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            return [year, month, day].join('-');
        }

        if (fs.existsSync(filePath)) {
            const getAllFiles = function (dirPath, arrayOfFiles) {
                arrayOfFiles = arrayOfFiles || []
                if (fs.statSync(dirPath).isDirectory()) {
                    files = fs.readdirSync(dirPath)

                    files.forEach(function (file) {
                        var fileInfo = fs.statSync(dirPath + "/" + file)
                        var obj = {
                            fileName: file,
                            filePath: dirPath + "/" + file,
                            size: fileInfo.size,
                            isDirectory: fileInfo.isDirectory(),
                            createdAt: formatDate(fileInfo.birthtime)
                        }
                        if (fileInfo.isDirectory()) {
                            arrayOfFiles.push(obj)
                            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
                        } else {
                            arrayOfFiles.push(obj)
                        }
                    })
                    return arrayOfFiles
                } else {
                    var fileInfo = fs.statSync(dirPath)
                    var obj = {
                        fileName: path.basename(dirPath),
                        filePath: dirPath,
                        size: fileInfo.size,
                        isDirectory: fileInfo.isDirectory(),
                        createdAt: formatDate(fileInfo.birthtime)
                    }
                    arrayOfFiles.push(obj)
                    return arrayOfFiles
                }

            }

            resolve(getAllFiles(filePath))
        } else {
            reject(`Invalid Path`)
        }

    })
};


module.exports = main;