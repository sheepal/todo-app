const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. 미들웨어 설정 (한 번만!)
app.use(cors());
app.use(express.json());

// 2. DB 연결 로직 (서버리스 최적화)
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    // 버퍼링 타임아웃 방지를 위해 옵션 추가
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, 
    });
    isConnected = true;
    console.log('✅ MongoDB 연결 성공');
  } catch (err) {
    console.error('❌ DB 연결 실패:', err.message);
  }
};

// 모든 요청이 올 때마다 DB 연결 상태 확인
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// 3. 모델 정의 (서버리스 환경에서는 기존 모델이 있는지 먼저 확인해야 함)
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }
});
const Todo = mongoose.models.Todo || mongoose.model('Todo', todoSchema);

// 4. API 라우트들
app.get('/', (req, res) => {
  res.send('서버가 정상적으로 작동 중입니다! API 경로는 /api/todos 입니다.');
})

app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/todos', async (req, res) => {
  try {
    if (!req.body.title) return res.status(400).json({ message: "title이 없어요!" });
    const newTodo = new Todo({ title: req.body.title });
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/todos/:id', async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { completed: req.body.completed },
      { new: true }
    );
    if (!updatedTodo) return res.status(404).json({ message: "할 일을 찾을 수 없어요." });
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) return res.status(404).json({ message: "삭제할 대상을 찾지 못했어요." });
    res.json({ message: "삭제 완료!" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 5. Vercel용 내보내기 (app.listen은 필요 없음!)
module.exports = app;