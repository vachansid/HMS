const express = require("express");
const router = express.Router();
const mysql = require("mysql");
// const cors = require('cors')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "hospital1",
});

function get_Current_Date(){
  const options = { year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit',hour12: false, timeZone: "Asia/Kolkata"};
  const formattedDate = new Date().toLocaleString('en-US', options).replace(',', '').replace(/\//g, '-').replace(/\s/g, 'T').replace('T', ' ');                    
  const [dateString, time] = formattedDate.split(' ');
  const [hour,min,sec] = time.split(':');
  const [month, day, year] = dateString.split('-'); // split the string into components
  let dtime;
  if(hour==="24") dtime = "00" + ':' + min + ':' + sec;
  else  dtime = hour + ':' + min + ':' + sec;

  dDate = year + '-' + month + '-' + day; // concatenate components in yyyy-mm-dd format
  const Registration_date = dDate + ' ' + dtime;
  return Registration_date;
}

function update_Current_Date(Scheduled_Date){
  const options = { year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit',hour12: false, timeZone: "Asia/Kolkata"};
  let formattedDate = new Date(Scheduled_Date);
  formattedDate = formattedDate.toLocaleString('en-US', options).replace(',', '').replace(/\//g, '-').replace(/\s/g, 'T').replace('T', ' ');                    
  const [dateString, time] = formattedDate.split(' ');
  const [hour,min,sec] = time.split(':');
  const [month, day, year] = dateString.split('-'); // split the string into components
  let dtime;
  if(hour==="24") dtime = "00" + ':' + min + ':' + sec;
  else  dtime = hour + ':' + min + ':' + sec;
  dDate = year + '-' + month + '-' + day; // concatenate components in yyyy-mm-dd format
  const Registration_date = dDate;
  return Registration_date;
}

function sendEmail(to,subject,text){

  return new Promise((resolve,reject)=>{

    var transpoter=nodemailer.createTransport({
      service:"gmail",
      auth:{
        user:'vemuriharsha2003@gmail.com',
        pass:'nbpxqekhlmgjeuqn',
      },
    })
    const mail_configs={
      from:'vemuriharsha2003@gmail.com',
      to:to,
      subject: subject,
      text: text,
    }
    transpoter.sendMail(mail_configs,(error,info)=>{
      if(error){
        console.log(error)
        return reject({message:"Error"})
      }
      return resolve({message:"Email sent"})
    })
  })
}

router.post("/", async (req, res) => {
  const { Username, Type, Email, Password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(Password, 10);

    db.query(
      "INSERT INTO Users_(Username, Type, Email, Password) VALUES (?, ?, ?, ?)",
      [Username, Type, Email, hashedPassword],
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send("Server error");
        } else 
        {
          console.log(result);
          res.status(200).send(result);
          if(Type==="Doctor"){
          db.query("INSERT INTO Doctor (Name,Doctor_id) values (?,?);",[Username,result.insertId],(err1,result1)=>{
          })}
          const deets="Greetings Mr/Mrs."+Username+",\n\nWe are delighted to inform you that your registration as a " + Type+" with CHAVY Hospitals has been successfully received and processed.\nYour User ID is "+result.insertId+". Please keep this ID and password safe and use it for any future communications .\n\nYour Details:\n\nUser ID: "+result.insertId+"\nPassword: "+Password+"\nName: "+Username+"\nMail ID: "+Email+"\n\nUse the above User ID and password for logging into the account.\n\nRegards,\nFront Desk Team\n"
          sendEmail(Email,"User Registration Details",deets).then(response=>{
            console.log(response.message)
          }).catch(err=>console.log(err.message))
          }
        }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

router.post("/doctor/", async (req, res) => {
  const { Name,ID,spec } = req.body;
  let id;
  try {
    //const hashedPassword = await bcrypt.hash(password, 10);
    // db.query("INSERT INTO Users_ (Username,Type,Email,Password) values (?,'Doctor',?,?)",[Name,email,password],(err1,result1)=>{
    //    if(!err1)
    //    {
    //      id=result1.insertId;
        db.query(
          "UPDATE Doctor set Specialization = ? where Doctor_id = ?",
          [spec,ID],
          (err, result) => {
            if(err) console.log(err)
            else{
            console.log(result);
            res.status(200).send(result);
            }
          }
        );
       } 
    //    else console.log(err1);   
    // })

    // db.query(
    //   "INSERT INTO Doctor (Name ,Doctor_id ,Specialization) values (?,?,?)",
    //   [Name, ID, spec],
    //   (err, result) => {
    //     console.log(result);
    //     res.status(200).send(result);
    //   }
    // );
   catch (error) {
    console.log("error2");
    console.error(error);
    res.status(500).send("Server error");
  }
});
router.delete("/delete/:UserID", async (req, res) => {
  const { UserID } = req.params;
  console.log(UserID);
  const date=get_Current_Date();
  db.query("UPDATE Doctor set Status=0 where Doctor_id = ?", UserID, (err, result)=>{
    if (err) {
      console.log(err);
      res.status(300).send(result)
    } else {
      db.query("DELETE from Users_ where UserID = ? AND Type!='Doctor';", UserID, (err1, result1) => {
        if (err1) {
          console.log(err1);
          res.status(300).send(result)
        } else {
          console.log(result1);
          db.query("DELETE from Appointment where Doctor_id=? AND Scheduled_Date > ?",[UserID,date],(err2,result2)=>{
            if(err2){
              console.log(err2)
              res.status(300).send(result)
            }
            else{
              console.log(result2);
              res.status(200).send(result)
            }
          })
          // res.status(200).send(result1)
        }
      });
      console.log(result);
    }
  })
//   db.query("DELETE from Users_ where UserID = ?;", UserID, (err, result) => {
//     //   console.log(result);
//     //   res.status(200).send(result);
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(result);
//     }

//   });
});

router.get("/doctor/:Username", async (req, res) => {
  const { Username } = req.params;
  db.query(
    "Select * from Users_ where UserID = ?;",
    Username,
    (err, result) => {
      res.status(200).send(result);
    }
  );
});

router.get("/", async (req, res) => {
  await db.query("SELECT U.* FROM Users_ as U LEFT JOIN Doctor as D ON U.UserID=D.Doctor_id WHERE U.Type != 'Doctor' OR D.Status != 0;", (err, result) => {
    console.log(result);
    res.status(200).send(result);
  });
});

router.get("/get/:UserID", async (req, res) => {
  const { UserID } = req.params;
  await db.query(
    "SELECT * FROM Users_ where UserID = ?",
    UserID,
    (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log(result);
      res.status(200).send(result);
    }
  );
});

router.put("/put/:id", async (req, res) => {
  const { id } = req.params;
  const { Username, Type, Email, Password } = req.body;
  await db.query(
    "UPDATE Users_ set  Username=?, Type=?, Email=?, Password=?  where UserID = ?",
    [Username, Type, Email, Password, id],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log(result);
      res.status(200).send(result);
    }
  );
});

router.put("/put/doctor/:id", async(req, res)=>{
  const {id} = req.params; 
  const { Name,ID,spec } = req.body;
  try {
       await db.query(
          "Update Doctor set Name = ? , Specialization = ? where Doctor_id = ?" ,
          [Name, spec, id],
          (err, result) => {
            if(err) console.log(err)
            console.log(result);
            res.status(200).send(result);
         }
        );
       } 
 
   catch (error) {
    console.log("error2");
    console.error(error);
    res.status(500).send("Server error");
  }
})

module.exports = router;
// router.delete()
