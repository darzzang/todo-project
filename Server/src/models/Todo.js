const mongoose = require('mongoose')

const todoSchema = mongoose.Schema({    // 스키마 정의
  name: { type : String, required: true, trim: true},   // 필수, 공백제거
  done : { type: Boolean, default : false}, // 필수 x
  description: { type : String, required : true, trim : true} 
})

const Todo = mongoose.model('Todo', todoSchema) // 스키마로부터 생성된 모델 객체
module.exports = Todo;  // 다른 파일에서 쓸 거기 때문에 내보냄