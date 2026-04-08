const mongoose = require('mongoose');

// 데이터의 '설계도'를 그립니다.
const todoSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true // 할 일 제목은 필수!
  },
  completed: { 
    type: Boolean, 
    default: false // 처음 만들 땐 당연히 '미완료' 상태겠죠?
  },
  createdAt: { 
    type: Date, 
    default: Date.now // 언제 만들었는지 기록용
  }
});

// 이 설계도를 가지고 실제 데이터를 주고받을 '모델'을 만듭니다.
module.exports = mongoose.model('Todo', todoSchema);