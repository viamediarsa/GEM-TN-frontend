const express = require('express');
const path = require('path');
const shell = require('shelljs');
const fs = require('fs-extra');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 8080;
const THEME_API_BASE = process.env.VITE_GEMTN_HOST || 'http://102.182.99.8:4001';

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
app.use(express.json());

// In-memory cache for theme colors (updated every 10 minutes from API)
const themeCache = {
  color: "#ffffff",
  navbarColor: "#1f2937",
  dailyChallengesColor: "#FFD014",
  gemStoreColor: "#2f2f2f",
  rewardsColor: "#10b981",
  flipTileColor: "#fecb01",
  playsContainerColor: "#000000",
  playsCounterImage: "",
  lastUpdated: null
};

// Function to fetch theme colors from external API
const fetchThemeColors = async () => {
  try {
    console.log('🔄 Fetching theme colors from API...');
    const endpoints = [
      { key: 'color', url: '/frontend/color', field: 'currentColor' },
      { key: 'navbarColor', url: '/frontend/navbar-color', field: 'currentColor' },
      { key: 'dailyChallengesColor', url: '/frontend/daily-challenges-color', field: 'currentDailyChallengesColor' },
      { key: 'gemStoreColor', url: '/frontend/gem-store-color', field: 'currentGemStoreColor' },
      { key: 'rewardsColor', url: '/frontend/rewards-color', field: 'currentRewardsColor' },
      { key: 'flipTileColor', url: '/frontend/flip-tile-color', field: 'currentTileColor' },
      { key: 'playsContainerColor', url: '/frontend/plays-container-color', field: 'currentPlaysContainerColor' },
      { key: 'playsCounterImage', url: '/frontend/plays-counter-image', field: 'currentPlaysCounterImage' }
    ];

    const updates = {};
    let hasUpdates = false;

    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(`${THEME_API_BASE}${endpoint.url}`, {
          timeout: 10000
        });
        const data = response?.data || {};
        let value = data[endpoint.field] || data.currentColor || null;
        
        // For base64 images, ensure they have the data URI prefix if needed
        if (endpoint.key === 'playsCounterImage' && value && typeof value === 'string' && value.trim() !== '') {
          // If it's already a data URI (starts with data:), use as-is
          // If it's just base64, add the data URI prefix
          if (!value.startsWith('data:')) {
            // Try to detect image type from base64 or default to png
            // Most common case: base64 string from API (without data URI prefix)
            value = `data:image/png;base64,${value}`;
          }
        } else if (endpoint.key === 'playsCounterImage' && (!value || value.trim() === '')) {
          // If empty or null, set to empty string (not null)
          value = '';
        }
        
        if (value !== null && themeCache[endpoint.key] !== value) {
          updates[endpoint.key] = value;
          hasUpdates = true;
        }
      } catch (err) {
        // Silently skip 404s or other errors - keep existing cache value
        if (err?.response?.status !== 404) {
          console.warn(`⚠️  Failed to fetch ${endpoint.key}:`, err?.message || err);
        }
      }
    }

    if (hasUpdates) {
      Object.assign(themeCache, updates);
      themeCache.lastUpdated = new Date().toISOString();
      console.log('✅ Theme colors updated:', Object.keys(updates));
    } else {
      themeCache.lastUpdated = new Date().toISOString();
      console.log('✅ Theme colors checked (no changes)');
    }
  } catch (error) {
    console.error('❌ Error fetching theme colors:', error?.message || error);
  }
};

// Frontend endpoints for getting cached theme colors
app.get('/api/frontend/color', (req, res) => {
  res.json({ currentColor: themeCache.color });
});

app.get('/api/frontend/navbar-color', (req, res) => {
  res.json({ currentColor: themeCache.navbarColor, currentNavbarColor: themeCache.navbarColor });
});

app.get('/api/frontend/daily-challenges-color', (req, res) => {
  res.json({ currentDailyChallengesColor: themeCache.dailyChallengesColor });
});

app.get('/api/frontend/gem-store-color', (req, res) => {
  res.json({ currentGemStoreColor: themeCache.gemStoreColor, currentColor: themeCache.gemStoreColor });
});

app.get('/api/frontend/rewards-color', (req, res) => {
  res.json({ currentRewardsColor: themeCache.rewardsColor, currentColor: themeCache.rewardsColor });
});

app.get('/api/frontend/flip-tile-color', (req, res) => {
  res.json({ currentTileColor: themeCache.flipTileColor, currentColor: themeCache.flipTileColor });
});

app.get('/api/frontend/plays-container-color', (req, res) => {
  res.json({ currentPlaysContainerColor: themeCache.playsContainerColor, currentColor: themeCache.playsContainerColor });
});

app.get('/api/frontend/plays-counter-image', (req, res) => {
  // Ensure base64 string is properly formatted for frontend use
  let imageData = themeCache.playsCounterImage;
  if (imageData && typeof imageData === 'string' && imageData.trim() !== '' && !imageData.startsWith('data:')) {
    // If it's just base64 without data URI prefix, add it
    imageData = `data:image/png;base64,${imageData}`;
  } else if (!imageData || (typeof imageData === 'string' && imageData.trim() === '')) {
    // Return null if empty string
    imageData = null;
  }
  res.json({ currentPlaysCounterImage: imageData });
});

// All other GET requests not handled before will return the React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    await buildAndMoveDist();
    
    // Initial fetch of theme colors
    await fetchThemeColors();
    
    // Poll for theme color updates every 10 minutes (600000ms)
    setInterval(fetchThemeColors, 600000);
    console.log('🎨 Theme color polling started (every 10 minutes)');
});