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

app.use('/static', express.static(__dirname +'/public'))
app.use(cors(corsOptions))   // cors 설정
app.use(express.json()) // request body 파싱
app.use(logger('tiny')) // Logger 설정

app.set('case sensitive routing', true)

app.get("/home", (req,res) => {
    res.redirect('/static/index.html')
})

app.get("/index", (req,res) => {
    res.sendFile(__dirname +'/public/index.html')
})

app.get("/detail", (req, res) => {
    res.sendFile(__dirname +'/public/detail.html')
})

// app.get("/google", (req,res) => {
//     res.redirect("https://www.google.co.kr/")
// })

// app.get("/hello", (req,res) => {
//     res.json({user: "syleemomo", msg:"hello!"})
// })

app.get("/shirts", (req,res)=> {
    res.send(`feature - color : ${req.query.color} / size: ${req.query.size}`)
})

app.get("/fruits/:name",
    (req,res,next) => {
        if (req.params.name !== "apple") return next()
        res.send("[logic 1] you choose apple for your favorite fruit !")
    },
    (req, res, next) => {
        if (req.params.name !== "banana") return next()
        res.send("[logic 2] you choose banana for your favorite fruit !")
    },
    (req, res) => {
        res.send(`[logic 3] you choose ${req.params.name} for your favorite fruit !`)
    }
)

app.get("/about", () => { 
    res.send('this is about page !') 
})

app.get("/chance",(req,res,next) => {
    if (Math.random() < 0.5) return next()
    res.send("first one")
})

app.get("/chance", (req, res) => {
    res.send("second one")
})

const blockFirstUser = (req, res, next) => {
    if (req.params.name === "kim") {
        res.status(401).send("you are not authorized to this page !")
    } next()
}

const blockSecondUser = (req, res, next) => {
    if (req.params.name === "park") {
        res.status(401).send("you are not authorized to this page !")
    } next()
}

const allowThisUser = (req, res) => {
    res.send("you can see this home page !")
}

app.get("/home/users/:name", [
    blockFirstUser,
    blockSecondUser,
    allowThisUser
])

app.get('/go+gle', (req, res) => {
    res.send("google site")
})

app.get("/sylee((mo)+)?", (req, res) => {
    res.send("site found!")
})

app.get(/^\/users\/(\d{4})$/,(req,res) => {
    console.log(req.params)
    res.send(`user id ${req.params[0]} found successfully !`)
})

app.get("/users/:userId([a-z]{4})",(req,res) => {
    console.log(req.params)
    res.send(`user id ${req.params.userId} found !`)
})

app.get("/users*", (req, res) => { 
    // 데이터베이스에서 사용자 전체목록 조회 
    res.send("users wildcards !")
 })

app.get('/users/contact', (req, res) => {
    res.send('contact page !')
})

app.get('/users/city', (req, res) => {
    res.send('city page !')
})

app.post('/users',(req, res) => {
    console.log(req.body.newUser)
    res.json(`new user - ${req.body.newUser.name} created !`)
})

app.put("/users/:id",(req,res) => {
    console.log(req.body.UserInfoToUpdate)
    // 데이터베이스에서 id 에 해당하는 사용자 정보 조회 후 업데이트 (몽고db에서 검색)
    res.send(
        `user ${req.params.id} updated with payload ${req.body.UserInfoToUpdate.name}`
        )
})

app.delete("/users/:id", (req,res) => {
    console.log(req.params.id)
    // 데이터베이스에서 id 에 해당하는 사용자 조회 후 제거
    res.send(`user ${req.params.id} removed!`)
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