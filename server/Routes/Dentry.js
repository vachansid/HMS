const express = require("express");
const rout = express.Router();
const mysql = require("mysql");
const cors = require('cors')
const fileupload = require("express-fileupload");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs=require("fs");
const nodemailer=require("nodemailer")
//const multer = require("multer");
rout.use(fileupload());

rout.use(express.static("files"))
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
  const Registration_date = dDate+" "+dtime;
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

rout.get("/", async (req, res) => {
 
  await db.query(
    "SELECT Patient_id,Name,Gender,Phone,Mail  FROM Patient;",
    (err, result) => {
      console.log(result);
      res.status(200).send(result);
    }
  );
});

rout.post("/post/test/:PT_id", async (req, res) => {
  const { PT_id } = req.params;
  const { Result } = req.body;
  await db.query(
    "UPDATE PrescribedTests set Result=? where PT_id=?",
    [Result, PT_id],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      else
      {
      console.log(result);
      res.status(200).send(result);
      console.log(1);
      db.query("SELECT T.Name as T_Name,D.Username as D_Name,P.Name as P_Name,DATE(Scheduled_date) as Date,Mail,Email,Result from PrescribedTests as PT,Patient as P,Users_ as D,Test as T where PT.PT_id= ? AND PT.Patient_id=P.Patient_id AND PT.Doctor_id=D.UserID AND T.Test_id=PT.Test_id",[PT_id],(err1,result1)=>{
        if(!err1)
        {
         console.log(result1);
         console.log(1);
         const deetsforpat="Greetings Mr/Mrs."+result1[0].P_Name+",\n\n                        This mail is from the CHAVY Hospitals to inform you that the results of "+result1[0].T_Name+" prescribed by Dr."+result1[0].D_Name+" and scheduled on "+result1[0].Date+" are been updated.\n\nSo, we request you to have a look and contact the doctor.\n\nResults:\n\nTest Name: "+result1[0].T_Name+"\nScheduled Date: "+result1[0].Date+"\nPrescribed by: "+result1[0].D_Name+"\nResult: "+result1[0].Result+"\n\n\nSincerely,\nCHAVY Hospitals"
         sendEmail(result1[0].Mail,"Test Details",deetsforpat).then(response=>{
         console.log(response.message)
         }).catch(err=>console.log(err.message))
         const deetsfordoc="Greetings Dr."+result1[0].D_Name+",\n\n                        This mail is the from CHAVY Hospitals to inform you that the results of "+result1[0].T_Name+" prescribed by you to Mr/Mrs."+result1[0].P_Name+" and scheduled on "+result1[0].Date+" are been updated.\n\nSo, we request you to have a look and contact the patient if needed.\n\nResults:\n\nTest Name: "+result1[0].T_Name+"\nScheduled Date: "+result1[0].Date+"\nPrescribed to: "+result1[0].P_Name+"\nResult: "+result1[0].Result+"\n\n\nSincerely,\nCHAVY Hospitals"
         sendEmail(result1[0].Email,"Test Details of"+result1[0].P_Name,deetsfordoc).then(response=>{
         console.log(response.message)
         }).catch(err=>console.log(err.message))
        }
        else 
        {console.log(err1)}
      });
     }
    }
)})

rout.get("/get/tests/:Patient_id", async (req, res) => {
  const { Patient_id } = req.params;
  await db.query(
    "SELECT P.PT_id as PT_id,Pa.Name as Patient, D.Name as Doctor, T.Name as Test, P.Result as Result ,T.Test_id as Test_id,Pa.Patient_id as Patient_id ,P.Scheduled_Date as Date FROM PrescribedTests as P,Test as T, Patient as Pa, Doctor as D WHERE P.Test_id=T.Test_id and P.Patient_id=? and Pa.Patient_id=P.Patient_id and D.Doctor_id=P.Doctor_id;",
    [Patient_id],
    (err, result) => {
      if(!err){
        console.log(result);
        
               formattedResult = result.map((row) => {
                const formattedScheduledDate = update_Current_Date(row.Date);
                return {
                  ...row,
                  Date: formattedScheduledDate,
                };
              });
              res.status(200).send(formattedResult);
              console.log(formattedResult);
         }
    }
  );
});

rout.get("/get/test/:PT_id", async (req, res) => {
  const { PT_id } = req.params;
  await db.query(
    "SELECT P.PT_id as PT_id ,Pa.Name as Patient,Pa.Patient_id as Patient_id, D.Name as Doctor, T.Name as Test, P.Result as Result  FROM PrescribedTests as P,Test as T, Patient as Pa, Doctor as D WHERE P.Test_id=T.Test_id and P.PT_id=? and Pa.Patient_id=P.Patient_id and D.Doctor_id=P.Doctor_id ;",
    [PT_id],
    (err, result) => {
      if(!err){
        console.log(result);
      
               formattedResult = result.map((row) => {
                const formattedScheduledDate = update_Current_Date(row.Date);
                return {
                  ...row,
                  Date: formattedScheduledDate,
                };
              });
              res.status(200).send(formattedResult);
               console.log(formattedResult);
         }
    }
  );
});

rout.get("/get/treatments/:Patient_id", async (req, res) => {
  const { Patient_id } = req.params;
  console.log(Patient_id)
  await db.query(
    "SELECT U.U_id as U_id, Pa.Name as Patient, D.Name as Doctor, T.Name as Treatment, U.Result as Result ,T.Treatment_id as Treatment_id, Pa.Patient_id as Patient_id,U.Scheduled_Date as Date FROM Undergoes as U,Treatment as T, Patient as Pa, Doctor as D WHERE U.Treatment_id=T.Treatment_id and U.Patient_id=? and Pa.Patient_id=U.Patient_id and D.Doctor_id=U.Doctor;",
    [Patient_id],
    (err, result) => {
      if(!err){
      console.log(result);
    
              formattedResult = result.map((row) => {
              const formattedScheduledDate = update_Current_Date(row.Date);
              return {
                ...row,
                Date: formattedScheduledDate,
              };
            });
            res.status(200).send(formattedResult);
             console.log(formattedResult);
       }
  
    }
  );
});

rout.post("/post/treatment/:U_id", async (req, res) => {
  const { U_id } = req.params;
  const { Result } = req.body;
  await db.query(
    "UPDATE Undergoes set Result=? where U_id=?",
    [Result, U_id],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      else{
      console.log(result);
      res.status(200).send(result);
      db.query("SELECT T.Name as T_Name,D.Username as D_Name,P.Name as P_Name,Scheduled_date as Date,Mail,Email,Result from Undergoes as PT,Patient as P,Users_ as D,Treatment as T where PT.U_id= ? AND PT.Patient_id=P.Patient_id AND PT.Doctor=D.UserID AND T.Treatment_id=PT.Treatment_id",[U_id],(err1,result1)=>{
        if(!err1)
        {
         console.log(result1);
         console.log(1);
         const deetsforpat="Greetings Mr/Mrs."+result1[0].P_Name+",\n\n                        This mail is from the CHAVY Hospitals to inform you that the results of the treatment "+result1[0].T_Name+" prescribed by Dr."+result1[0].D_Name+" and scheduled on "+result1[0].Date+" are been updated.\n\nSo, we request you to have a look and contact the doctor.\n\nResults:\n\nTreatment Name: "+result1[0].T_Name+"\nScheduled Date: "+result1[0].Date+"\nPrescribed by: "+result1[0].D_Name+"\nResult: "+result1[0].Result+"\n\n\nSincerely,\nCHAVY Hospitals"
         sendEmail(result1[0].Mail,"Treatment Details",deetsforpat).then(response=>{
         console.log(response.message)
         }).catch(err=>console.log(err.message))
         const deetsfordoc="Greetings Dr."+result1[0].D_Name+",\n\n                        This mail is the from CHAVY Hospitals to inform you that the results of the treatment "+result1[0].T_Name+" prescribed by you to Mr/Mrs."+result1[0].P_Name+" and scheduled on "+result1[0].Date+" are been updated.\n\nSo, we request you to have a look and contact the patient if needed.\n\nResults:\n\nTreatment Name: "+result1[0].T_Name+"\nScheduled Date: "+result1[0].Date+"\nPrescribed to: "+result1[0].P_Name+"\nResult: "+result1[0].Result+"\n\n\nSincerely,\nCHAVY Hospitals"
         sendEmail(result1[0].Email,"Treatment Details of "+result1[0].P_Name,deetsfordoc).then(response=>{
         console.log(response.message)
         }).catch(err=>console.log(err.message))
        }
        else 
        {console.log(err1)}
      });
       
      }
    }
  );
});

rout.get("/get/treatment/:U_id", async (req, res) => {
  const { U_id } = req.params;
  await db.query(
    "SELECT Pa.Name as Patient,Pa.Patient_id as Patient_id, D.Name as Doctor, T.Name as Treatment, U.Result as Result  FROM Undergoes as U,Treatment as T, Patient as Pa, Doctor as D WHERE U.Treatment_id=T.Treatment_id and U.U_id=? and Pa.Patient_id=U.Patient_id and D.Doctor_id=U.Doctor ;",
    [U_id],
    (err, result) => {
      if(!err){
        console.log(result);
        
        formattedResult = result.map((row) => {
        const formattedScheduledDate = update_Current_Date(row.Date);
        return {
                    ...row,
                    Date: formattedScheduledDate,
                  };
        });
        res.status(200).send(formattedResult);
        console.log(formattedResult);
         
        
        }
    }
  );
});

//////////////////////////////////////////
rout.get("/get/doctors", (req, res) => {
  db.query(
    "SELECT  Doctor.Name ,Doctor.Doctor_id From Doctor Where Doctor.Doctor_id is not null ;",
    (err, result) => {
      res.status(200).send(result);
    }
  );
});

rout.get("/get/tests", (req, res) => {
  db.query("SELECT  Test.Name ,Test.Test_id From Test ;", (err, result) => {
    console.log("*");
    res.status(200).send(result);
  });
});

rout.get("/get/treatments", (req, res) => {
  db.query(
    "SELECT  Treatment.Name ,Treatment.Treatment_id From Treatment;",
    (err, result) => {
      console.log("*");
      res.status(200).send(result);
    }
  );
});
/////////////////////////////////////////////////////////////
// rout.post("/addtest/", async (req, res) => {
//   const { Test, patientID, Doctor } = req.body;

//   try {
//     db.query(
//       "INSERT INTO PrescribedTests (Test_id ,Patient_id ,Doctor_id,Scheduled_Date) values (?,?,?,NOW())",
//       [Test, patientID, Doctor],
//       (err, result) => {
//         console.log(result);
//         res.status(200).send(result);
//       }
//     );
//   } catch (error) {
//     console.log("error2");
//     console.error(error);
//     res.status(500).send("Server error");
//   }
// });

// rout.post("/addtreatment/", async (req, res) => {
//   const { Treatment, patientID, Doctor } = req.body;

//   try {
//     db.query(
//       "INSERT INTO Undergoes (Treatment_id ,Patient_id ,Doctor,Scheduled_Date) values (?,?,?,NOW())",
//       [Treatment, patientID, Doctor],
//       (err, result) => {
//         console.log(result);
//         res.status(200).send(result);
//       }
//     );
//   } catch (error) {
//     console.log("error2");
//     console.error(error);
//     res.status(500).send("Server error");
//   }
// });

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });
 
rout.post("/uploadtest/:PT_id", (req, res) => {
  const newpath = __dirname + "/test_results/";
  const {PT_id}=req.params;

  console.log(req);
  const filee = req.files.file;
  console.log(req.files.file)
  const filename = filee.name;
  const folderPath =`${newpath}${PT_id}${"/"}`
  // Check if the folder exists, and create it if it does not
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
  // res.send({dam:"dam"})
  filee.mv(`${folderPath}${filename}`, (err) => {
    console.log(err);
    if (err) {
      res.status(500).send({ message: "File upload failed", code: 200 });
    }
    else{
    res.status(200).send({ message: "File Uploaded", code: 200 });
    db.query("SELECT T.Name as T_Name,D.Username as D_Name,P.Name as P_Name,DATE(Scheduled_date) as Date,Mail,Email,Result from PrescribedTests as PT,Patient as P,Users_ as D,Test as T where PT.PT_id= ? AND PT.Patient_id=P.Patient_id AND PT.Doctor_id=D.UserID AND T.Test_id=PT.Test_id",[PT_id],(err1,result1)=>{
      if(!err1)
      {
       console.log(result1);
       console.log(1);
       const deetsforpat="Greetings Mr/Mrs."+result1[0].P_Name+",\n\n                        This mail is from the CHAVY Hospitals to inform you that the results of "+result1[0].T_Name+" prescribed by Dr."+result1[0].D_Name+" and scheduled on "+result1[0].Date+" are been updated.\n\nSo, we request you to have a look and contact the doctor.\n\nResults:\n\nTest Name: "+result1[0].T_Name+"\nScheduled Date: "+result1[0].Date+"\nPrescribed by: "+result1[0].D_Name+"\nResult: "+"Files are sent to doctor"+"\n\n\nSincerely,\nCHAVY Hospitals"
       sendEmail(result1[0].Mail,"Test Files",deetsforpat).then(response=>{
       console.log(response.message)
       }).catch(err=>console.log(err.message))
       const deetsfordoc="Greetings Dr."+result1[0].D_Name+",\n\n                        This mail is the from CHAVY Hospitals to inform you that the results of "+result1[0].T_Name+" prescribed by you to Mr/Mrs."+result1[0].P_Name+" and scheduled on "+result1[0].Date+" are been updated.\n\nSo, we request you to have a look and contact the patient if needed.\n\nResults:\n\nTest Name: "+result1[0].T_Name+"\nScheduled Date: "+result1[0].Date+"\nPrescribed to: "+result1[0].P_Name+"\nResult: "+"Files are uploaded to your dashboard"+"\n\n\nSincerely,\nCHAVY Hospitals"
       sendEmail(result1[0].Email,"Test Files of"+result1[0].P_Name,deetsfordoc).then(response=>{
       console.log(response.message)
       }).catch(err=>console.log(err.message))
      }
      else 
      {console.log(err1)}
    });
    }
  });
});


rout.post("/uploadtreatment/:U_id", (req, res) => {
  const newpath = __dirname + "/treatment_results/";
  const {U_id}=req.params;

  console.log(req);
  const filee = req.files.file;
  console.log(req.files.file)
  const filename = filee.name;
  const folderPath =`${newpath}${U_id}${"/"}`
  // Check if the folder exists, and create it if it does not
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
  // res.send({dam:"dam"})
  filee.mv(`${folderPath}${filename}`, (err) => {
    console.log(err);
    if (err) {
      res.status(500).send({ message: "File upload failed", code: 200 });
    }
    else{
    res.status(200).send({ message: "File Uploaded", code: 200 });
    db.query("SELECT T.Name as T_Name,D.Username as D_Name,P.Name as P_Name,Scheduled_date as Date,Mail,Email,Result from Undergoes as PT,Patient as P,Users_ as D,Treatment as T where PT.U_id= ? AND PT.Patient_id=P.Patient_id AND PT.Doctor=D.UserID AND T.Treatment_id=PT.Treatment_id",[U_id],(err1,result1)=>{
      if(!err1)
      {
       console.log(result1);
       console.log(1);
       const deetsforpat="Greetings Mr/Mrs."+result1[0].P_Name+",\n\n                        This mail is from the CHAVY Hospitals to inform you that the results of the treatment "+result1[0].T_Name+" prescribed by Dr."+result1[0].D_Name+" and scheduled on "+result1[0].Date+" are been updated.\n\nSo, we request you to have a look and contact the doctor.\n\nResults:\n\nTreatment Name: "+result1[0].T_Name+"\nScheduled Date: "+result1[0].Date+"\nPrescribed by: "+result1[0].D_Name+"\nResult: "+"Files are uploaded"+"\n\n\nSincerely,\nCHAVY Hospitals"
       sendEmail(result1[0].Mail,"Treatment Files",deetsforpat).then(response=>{
       console.log(response.message)
       }).catch(err=>console.log(err.message))
       const deetsfordoc="Greetings Dr."+result1[0].D_Name+",\n\n                        This mail is the from CHAVY Hospitals to inform you that the results of the treatment "+result1[0].T_Name+" prescribed by you to Mr/Mrs."+result1[0].P_Name+" and scheduled on "+result1[0].Date+" are been updated.\n\nSo, we request you to have a look and contact the patient if needed.\n\nResults:\n\nTreatment Name: "+result1[0].T_Name+"\nScheduled Date: "+result1[0].Date+"\nPrescribed to: "+result1[0].P_Name+"\nResult: "+"Files are uploaded. Please check your dashboard to download the files"+"\n\n\nSincerely,\nCHAVY Hospitals"
       sendEmail(result1[0].Email,"Treatment Files of "+result1[0].P_Name,deetsfordoc).then(response=>{
       console.log(response.message)
       }).catch(err=>console.log(err.message))
      }
      else 
      {console.log(err1)}
    });
    }
  });
});

rout.get("/files/Test/:PT_id",async(req,res)=>{
  const PT_id=req.params.PT_id;
  const folderPath=__dirname+`/test_results/${PT_id}/`;
  console.log(PT_id);
  fs.readdir(folderPath,(err,files)=>{
    if(err)
    {
      console.log(err);
      return;
    }
    res.send(files);
    console.log(typeof files)
    console.log(files)
  })
})

rout.get("/files/Treatment/:U_id",async(req,res)=>{
  const U_id=req.params.U_id;
  const folderPath=__dirname+`/treatment_results/${U_id}/`;
console.log(U_id);
  fs.readdir(folderPath,(err,files)=>{
    if(err)
    {
      console.log(err);
      return;
    }
    res.send(files);
    console.log(typeof files)
    console.log(files)
  })
})


rout.get("/download/test/:PT_id/:filename",async(req,res)=>{  
  const PT_id=req.params.PT_id;
  const filename=req.params.filename;
  const folderPath=__dirname+`/test_results/${PT_id}/${filename}`;
  console.log(folderPath)
  if (!fs.existsSync(folderPath)) {
    return res.status(404).send({ error: 'File not found' });
  }
  res.download(folderPath, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('File sent successfully');
    }
  });
});

rout.get("/download/treatment/:U_id/:filename",async(req,res)=>{  
  const U_id=req.params.U_id;
  const filename=req.params.filename;
  const folderPath=__dirname+`/treatment_results/${U_id}/${filename}`;
  console.log(folderPath)
  if (!fs.existsSync(folderPath)) {
    return res.status(404).send({ error: 'File not found' });
  }
  res.download(folderPath, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('File sent successfully');
    }
  });
});

module.exports = rout;
