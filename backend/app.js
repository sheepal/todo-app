const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// 모델 파일을 못 찾을 경우를 대비해 직접 정의 (임시)
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }
});
const Todo = mongoose.models.Todo || mongoose.model('Todo', todoSchema);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // JSON 해석 미들웨어

// DB 연결 시도 및 로그 출력
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ [DB] MongoDB Atlas 연결 성공!'))
  .catch((err) => console.error('❌ [DB] 연결 실패 상세 이유:', err));

// [조회]
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    console.error("GET 에러:", err); // 터미널에 에러 찍기
    res.status(500).json({ error: err.message });
  }
});

// [추가]
app.post('/api/todos', async (req, res) => {
  try {
    console.log("받은 데이터:", req.body); // 데이터가 잘 오는지 확인
    if (!req.body.title) return res.status(400).json({ message: "title이 없어요!" });
    
    const newTodo = new Todo({ title: req.body.title });
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    console.error("POST 에러:", err);
    res.status(400).json({ error: err.message });
  }
});

// [수정] 특정 할 일의 상태를 변경 (PUT /api/todos/:id)
app.put('/api/todos/:id', async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id, // URL에서 전달된 ID
      { completed: req.body.completed }, // 수정할 내용
      { new: true } // 수정된 결과를 반환받겠다는 옵션
    );
    
    if (!updatedTodo) return res.status(404).json({ message: "할 일을 찾을 수 없어요." });
    
    res.json(updatedTodo);
  } catch (err) {
    console.error("PUT 에러:", err);
    res.status(400).json({ error: err.message });
  }
});

// [삭제] 특정 할 일 삭제 (DELETE /api/todos/:id)
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    
    if (!deletedTodo) return res.status(404).json({ message: "삭제할 대상을 찾지 못했어요." });
    
    res.json({ message: "삭제 완료!" });
  } catch (err) {
    console.error("DELETE 에러:", err);
    res.status(400).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${port}`);
});