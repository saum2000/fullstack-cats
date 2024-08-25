import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const app = express();
const port = 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage
let storedData;

const loadConfig = async () => {
  const configPath = path.join(__dirname, 'src/helpers', 'config.json');
  const data = await fs.readFile(configPath, 'utf-8');
  return JSON.parse(data);
};

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API Routes
app.get('/cats', async (req, res) => {
  try {
    await delay(2000);
    if (!storedData) {
      storedData = await loadConfig(); // Load from config.json if no data is stored
    }
    res.json(storedData);
  } catch (error) {
    console.error('Error loading config:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.put('/cats', async (req, res) => {
  await delay(2000);
  storedData = req.body; // Update the in-memory storage
  console.info('Updating data:', storedData);
  res.send('Saved');
});

// Start the server
app.listen(port, () => {
  console.info(`Server is running on http://localhost:${port}`);
});
