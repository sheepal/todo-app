const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// MongoDB 연결
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

app.get('/', (req, res) => {
  res.send('Hola mundo!');
});
//test api
app.get('/api/todos', (req, res) => {
  res.json([
    { id: 1, text: '공부하기', completed: false },
    { id: 2, text: '운동하기', completed: true }
  ]);
});

app.listen(port, () => {
  console.log(`이거 listening on port ${port}`);
});