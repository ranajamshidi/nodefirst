const express = require('express')
const multer = require('multer')
const request = require('postman-request')
const { getSystemErrorMap } = require('util')
const fs = require('fs')
const path = require('path')
const { error } = require('console')
const { enableNodeExtraCACerts } = require('postman-request')
const req = require('express/lib/request')

const app = express()
const port = process.env.PORT || 3000
let i=1
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images/');
    },
  
    filename: function(req, file, cb) {
        cb(null, i + path.extname(file.originalname));
    }
});
  
var upload = multer({ storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if(!file.originalname.endsWith('.jpg')) {
            return callback(new Error('Plead upload a jpg file'))
        }
        callback(null, true)
    },
    limits:{
        fileSize: 5000000
    }
})

app.post('/upload', upload.single('upload') , (req , res) => {
    res.send('Your picture id is:' + i)
    i++
}, (error, req, res, next) => {
    res.status(400).send({error : error.message})
})


// localhost:3000/pic/:id
app.get('/pic', (req,res)=>{
    const id=req.query.id
    if(!id){
        return res.send("please enter picture id")
     }
    res.sendFile(path.join(__dirname, '/images/' + id +'.jpg'))

    
})
app.listen(3000 , () => {
    console.log('server is up on port 3000')
})