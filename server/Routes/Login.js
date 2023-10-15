const express = require("express")
const router = express.Router()
const mysql = require('mysql')
// const cors = require('cors')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'hospital1'
});


router.get('/',(req,res)=>{
    const sql2="SELECT * from Users_";
    db.query(sql2,(err,result)=>{

        console.log(result);
        console.log(err);
        res.send("Hell1")
    });    
});


router.post('/', async (req, res) => {
  try {
    const { username, password, userType } = req.body;
    console.log(userType);
    console.log(username);

    db.query("SELECT * FROM Users_ WHERE UserID = ? AND Type=?", [username,userType], async (err, result) => {
      if (result.length == 0) {
        return res.status(401).send({ message: 'Invalid username/password' });
      } else {
        const user = result[0];
        console.log(user);
        const match = await bcrypt.compare(password, user.Password);

        if (match) {
          // const token=jwt.sign(
          //   {},process.env.JWT_KEY,{expiresIn:"1h"}
          // )
          console.log(user);
          res.status(200).send(user);
        } else {
          return res.status(401).send({ message: 'Invalid username/password' });
        }
      }
    });
  } catch (error) {
    console.log('error1');
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router