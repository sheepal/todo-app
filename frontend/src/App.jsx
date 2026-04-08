import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState([]); // Todo 목록 저장
  const [input, setInput] = useState(""); // 입력창 텍스트 저장

  // 백엔드 서버 주소 (로컬 테스트용)
  const API_URL = "http://localhost:3000/api/todos";

  // 페이지가 처음 열릴 때 목록을 불러옵니다 (조회 - READ)
  useEffect(() => {
    fetchTodos();
  }, []);

  // 1. [조회] GET /api/todos
  const fetchTodos = async () => {
    try {
      const res = await axios.get(API_URL);
      setTodos(res.data);
    } catch (err) {
      console.error("목록 로딩 실패:", err);
    }
  };

  // 2. [추가] POST /api/todos
  const addTodo = async (e) => {
    e.preventDefault(); // 페이지 새로고침 방지
    if (!input.trim()) return; // 빈 값은 무시

    try {
      await axios.post(API_URL, { title: input });
      setInput(""); // 입력창 초기화
      fetchTodos(); // 목록 새로고침
    } catch (err) {
      console.error("추가 실패:", err);
    }
  };

  // 3. [수정/토글] PUT /api/todos/:id
  const toggleComplete = async (id, completed) => {
    try {
      await axios.put(`${API_URL}/${id}`, { completed: !completed });
      fetchTodos(); // 상태 변경 후 새로고침
    } catch (err) {
      console.error("상태 변경 실패:", err);
    }
  };

  // 4. [삭제] DELETE /api/todos/:id
  const deleteTodo = async (id) => {
    if (!window.confirm("정말 삭제할까요?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTodos(); // 삭제 후 새로고침
    } catch (err) {
      console.error("삭제 실패:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-6 text-center">✅ My Todo App</h1>
        
        {/* 입력 폼 */}
        <form onSubmit={addTodo} className="flex gap-2 mb-6">
          <input 
            type="text"
            className="flex-1 border-2 border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-all"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="새로운 할 일을 적어보세요"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg transition-colors">
            추가
          </button>
        </form>

        {/* Todo 리스트 목록 */}
        <ul className="space-y-3">
          {todos.map((todo) => (
            <li 
              key={todo._id} 
              className="flex items-center justify-between bg-slate-50 p-4 rounded-lg border border-slate-100 group"
            >
              <div className="flex items-center gap-3">
                {/* 완료 체크박스 */}
                <input 
                  type="checkbox" 
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo._id, todo.completed)}
                  className="w-5 h-5 cursor-pointer"
                />
                <span className={`text-lg ${todo.completed ? "line-through text-slate-400" : "text-slate-700"}`}>
                  {todo.title}
                </span>
              </div>
              
              {/* 삭제 버튼 */}
              <button 
                onClick={() => deleteTodo(todo._id)}
                className="text-red-400 hover:text-red-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
              >
                삭제
              </button>
            </li>
          ))}
          {todos.length === 0 && (
            <p className="text-center text-slate-400 py-4">할 일이 없어요. 추가해 보세요!</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;