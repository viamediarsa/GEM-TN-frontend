const express = require('express');
const path = require('path');
const shell = require('shelljs');
const fs = require('fs-extra');
const app = express();
const PORT = process.env.PORT || 8080;

// Function to build the React app and move the dist folder
async function buildAndMoveDist() {
    console.log('Installing dependencies...');
    shell.cd('client');
    if (shell.exec('npm install').code !== 0) {
        shell.echo('Error: npm install failed');
        shell.exit(1);
    }

    console.log('Building the React app...');
    if (shell.exec('npm run build').code !== 0) {
        shell.echo('Error: React build failed');
        shell.exit(1);
    }
    shell.cd('..');

    console.log('Moving dist folder...');
    await fs.move('./client/dist', './dist', {
        overwrite: true
    }, err => {
        if (err) return console.error(err);
        console.log('Successfully moved dist folder.');
    });
}


// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));


// All other GET requests not handled before will return the React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    await buildAndMoveDist();
});