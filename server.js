const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies and serve static files
app.use(express.json());
app.use(express.static('public'));

// The Main API Route
app.post('/analyze', (req, res) => {
    const textToAnalyze = req.body.text;

    if (!textToAnalyze) {
        return res.status(400).json({ error: "No text provided" });
    }

    // 1. Spawn the Python process
    // 'python' command might be 'python3' on Mac/Linux
    const pythonProcess = spawn('python', ['analyzer.py', textToAnalyze]);

    let dataString = '';
    let errorString = '';

    // 2. Collect data from Python script
    pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
    });

    // 3. Handle errors
    pythonProcess.stderr.on('data', (data) => {
        errorString += data.toString();
    });

    // 4. Send response back to frontend when Python finishes
    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`Python script error: ${errorString}`);
            return res.status(500).json({ error: "Analysis failed" });
        }

        try {
            // Parse the JSON string from Python
            const parsedData = JSON.parse(dataString);
            res.json(parsedData);
        } catch (e) {
            console.error("JSON Parse Error:", e);
            res.status(500).json({ error: "Failed to parse Python output" });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});