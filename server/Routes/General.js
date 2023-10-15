const express = require("express")
const router = express.Router()
const mysql = require('mysql')


const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'hospital1'
});

router.get('/get_patients',async (req,res)=>{
  
  const query="SELECT * FROM Patient"
  db.query(query,(err,result)=>{
      res.send(result)
      console.log(result)
      console.log(err)
  });
});

router.get('/get_doctors',async (req,res)=>{
  
  const query="SELECT * FROM Doctor"
  db.query(query,(err,result)=>{
      res.send(result)
      console.log(result)
      console.log(err)
  });
});
router.get('/get/tests',async (req,res)=>{
  
  const query="SELECT * FROM Test"
  db.query(query,(err,result)=>{
      res.send(result)
      console.log(result)
      console.log(err)
  });
});
router.get('/get/treatments',async (req,res)=>{
  
  const query="SELECT * FROM Treatment"
  db.query(query,(err,result)=>{
      res.send(result)
      console.log(result)
      console.log(err)
  });
});

module.exports = router