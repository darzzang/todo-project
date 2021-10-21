const express = require('express')
const TodoRouter = express.Router()
const Todo = require("../models/Todo")  // ../으로 해당 폴더를 빠져나가 models 폴더의 Todo로 접근

TodoRouter.route('/').get(async(req,res) => {
    const todos = await Todo.find()
    console.log(todos)
    res.json({status: 200, todos})
})

TodoRouter.get('/:id',(req,res) => {
    Todo.findById(req.params.id, (err, todo) => {
        if(err) throw err;
        res.json({staus:200, todo}) //staus는 없어도 됨. 구분할려고 붙이는것
    })
})

TodoRouter.route('/').post((req,res)=> {
    Todo.findOne({name: req.body.name, done: false}, async(err,todo)=> { //중복체크
        if(err) throw err; //throw : 에러를 발생시키는 자바스크립트
        if(!todo){  //데이터베이스에서 해당 할일을 조회하지 못한 경우
            const newTodo = new Todo(req.body)
            await newTodo.save().then(() => {   //.then(): 저장이 끝날때까지 기다렸다가 끝나면 응답(비동기처리)
                res.json({status: 201, msg: 'new todo created in db !', newTodo}) //newTodo를 보냄
            })
        } else{ // 생성하려는 할일과 같은 이름이고 아직 끝내지 않은 할일이 이미 데이터베이스에 존재하는 경우
            const msg = 'this todo already exists in db !'
            console.log(msg)
            res.json({status:204, msg}) // 응답 보내줌
        }
    })
})

TodoRouter.put('/:id',(req,res)=> {
    Todo.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err,todo)=>{
        if(err) throw err;
        res.json({status:204, msg:`todo ${req.params.id} updated in db !`, todo})
    })
})

TodoRouter.delete('/:id',(req,res)=> {
   Todo.findByIdAndDelete(req.params.id, (err,todo)=>{
       if(err) throw err;
       res.json({staus:204, msg:`todo ${req.params.id} removed in db !`})
   })
})


module.exports = TodoRouter