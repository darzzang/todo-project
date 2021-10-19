const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name : { type : String, required: true, trim : true },
    age : { type : Number, required: true, trim : true },
    email : { type : String, required: true, trim : true },
    todos : { type : [todo], required: true, trim : true }
})

const User = mongoose.model('User', userSchema)
module.exports = User;