const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Helper function to generate random 25-character alphanumeric string
function generateRandomString() {
  return crypto.randomBytes(12).toString('hex');
}

app.get('/', (req, res) => {
  res.send('please move to /messages')
});

// Route to get all messages
app.get('/messages', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'messages.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read messages' });
    }

    const messages = JSON.parse(data).messages;
    res.json({ messages });
  });
});

// Route to add a message
app.get('/messages/add', (req, res) => {
  const newMessage = req.query.m;
  if (!newMessage) {
    return res.status(400).json({
      error: 'No message provided',
    });
  }

  const filePath = path.join(__dirname, 'data', 'messages.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({
        message: 'We couldn\'t add your message, sorry lmao.',
        error: err.message,
      });
    }

    const parsedData = JSON.parse(data);
    parsedData.messages.push(newMessage);

    fs.writeFile(filePath, JSON.stringify(parsedData, null, 2), (err) => {
      if (err) {
        return res.status(500).json({
          message: 'We couldn\'t add your message, sorry lmao.',
          error: err.message,
        });
      }

      const randomStr = generateRandomString();
      res.status(200).json({
        message: 'Message was added!',
        coc: `e=${randomStr}`,
      });
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
