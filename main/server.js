const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const app = express();
const port = 3000;

// Absolute paths to Python script and CSV file
const pythonScript = 'C:/Users/abhis/OneDrive/Desktop/opencv-object-detection/src/object-detection.py';
const csvPath = 'C:/Users/abhis/OneDrive/Desktop/opencv-object-detection/src/obj_csv_file.csv';

// Serve static files from the project root directory
app.use(express.static(__dirname)); // __dirname is the directory where server.js is located

// Start the object detection Python script
function startObjectDetection() {
    const pythonProcess = spawn('python', [pythonScript]);

    pythonProcess.stdout.on('data', (data) => {
        console.log(`Python stdout: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        console.log(`Python script exited with code ${code}`);
    });
}

// Fetch the latest row from the CSV file
// const csv = require('csv-parser');

function getLatestObjectData() {
    return new Promise((resolve, reject) => {
        const results = [];

        fs.createReadStream(csvPath)
            .pipe(csv({
                separator: ',',  // If your CSV uses a different separator like tabs
                skipEmptyLines: true // Skip empty lines in CSV
            }))
            .on('data', (data) => {
                console.log('CSV row:', data);  // Log each row
                results.push(data);
            })
            .on('end', () => {
                if (results.length > 0) {
                    const latestEntry = results[results.length - 1];
                    resolve({
                        objectName: latestEntry.object_name,  // Adjust according to the CSV structure
                        timestamp: latestEntry.timestamp      // Adjust according to the CSV structure
                    });
                } else {
                    resolve(null);
                }
            })
            .on('error', (error) => reject(error));
    });
}


// Route to start the object detection process
app.get('/start-object-detection', (req, res) => {
    startObjectDetection();
    mainLoop();
    res.send("Object detection started.");
});
// Function to poll the CSV file every second
function mainLoop() {
    setInterval(async () => {
        try {
            const data = await getLatestObjectData();
            if (data) {
                console.log(`Detected object: ${data.objectName} at ${data.timestamp}`);
            }
        } catch (error) {
            console.error(`Error reading CSV file: ${error.message}`);
        }
    }, 5000); // Poll every 1 second
}

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
