var express = require('express')   // node_modules 내 express 관련 코드를 가져온다
var app = express()
var cors = require('cors')
var logger = require('morgan')
var mongoose = require('mongoose')

var corsOptions = {
    origin : 'http://localhost:3000',
    Credentials: true
}

const CONNECT_URL = 'mongodb://localhost:27017/mydbname'
mongoose.connect(CONNECT_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("mongodb connected..."))
  .catch(e => console.log('failed to connect mongodb: ${e}'))


app.use(cors(corsOptions))   // cors 설정
app.use(express.json()) // request body 파싱
app.use(logger('tiny')) // Logger 설정

app.get('/hello', (req, res) => {   // URL 응답 테스트 ,위치 주의
    res.send('hello world!')
})

app.get('/', (req,res) => {     
    res.send('root url')
})

app.use((req, res, next) => {   // 사용자가 요청한 페이지가 없는 경우 에러처리
    res.status(404).send("Sorry can't find page")
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send("somthing is broken on server !")
})

app.listen(5000, () => {    // 5000 포트로 서버 오픈
    console.log('server is running on port 5000... - nodemon')
})

