const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to handle static files
app.use(express.static(path.join(__dirname, 'public')));

// Body parser to handle form submissions
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // For parsing application/json data

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Handle form submission
app.post('/login', (req, res) => {
  const email = req.body.email;
  // You can add your login logic here (authentication, etc.)
  res.send(`Form submitted! Email: ${email}`);
});

// Handle Google sign-in data from frontend
app.post('/auth/google', (req, res) => {
  const { email, uid } = req.body;
  // Handle user data here (e.g., save to the database)
  console.log(`Google Sign-In: Email: ${email}, UID: ${uid}`);
  res.json({ message: 'User authenticated successfully' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
