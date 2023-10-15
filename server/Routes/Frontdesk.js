
const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
const mysql = require("mysql");
const { response } = require("express");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "hospital1",
});

let dDate;
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

router.post('/patient_regist', async (req, res) => {

  try {
      const { Name,Address,Phone,Mail,Gender,DOB } = req.body;

      const Registration_date = get_Current_Date();
      
      console.log(Name)
      console.log(Address)
      console.log(Phone)
      console.log(Mail)
      console.log(Gender)
      console.log(DOB)
      console.log(Registration_date);
       
       await db.query("INSERT INTO Patient(Name,Address,Phone,Mail,Gender,DOB,Registration_date) VALUES (?,?,?,?,?,?,?)",[Name,Address,Phone,Mail,Gender,DOB,Registration_date],  (err, result)=>{
          if(err) {
            res.status(300).send(result);
            console.log(err)
          }
          else 
          {
            res.status(200).send(result);
            console.log(result.insertId);
            const deets="Dear "+Name+",\n\nWe are delighted to inform you that your registration with CHAVY Hospitals has been successfully received and processed.\nYour Patient ID is "+result.insertId+". Please keep this number safe and use it for any future communications with us.\n\nYour Details:\n\nPatient ID: "+result.insertId+"\nName: "+Name+"\nPhone Number: "+Phone+"\nMail ID: "+Mail+"\nDOB: "+DOB+"\nRegistration Date: "+Registration_date+"\n\nRegards,\nFront Desk Team\n"
            sendEmail(Mail,"Patient registration Details",deets).then(response=>{
              console.log(response.message)
            }).catch(err=>console.log(err.message))
          }
        }
      );
      

  } catch (error) {
      console.log("error1")
      console.error(error);
      res.status(500).send('Server error');
  }
});

router.get('/bookAppointment/getdoctors',async (req,res)=>{

  const query="SELECT * FROM Doctor,Users_ Where Doctor.Doctor_id=Users_.UserID AND Doctor.Status = 1"
  db.query(query,(err,result)=>{
    console.log(result)
    console.log(err)
    if(err)
    {
      res.status(300).send(result);
    }
    else 
    {
      res.status(200).send(result)
    }

  });
});

router.get('/unscheduled_tests',async (req,res)=>{

  const query="SELECT PT.PT_id, P.Name as P_Name, D.Name as D_Name, T.Name as T_Name, P.Patient_id, D.Doctor_id FROM Patient as P, Doctor as D, Test as T, PrescribedTests as PT WHERE (PT.Patient_id,PT.Doctor_id,PT.Test_id) = (P.Patient_id,D.Doctor_id,T.Test_id) AND PT.Scheduled_Date is NULL"
  
  db.query(query,(err,result)=>{
    console.log(result)
    console.log(err)
    if(err)
    {
      res.status(300).send(result);
    }
    else 
    {
      
      res.status(200).send(result);
    }

  });
});

router.get('/scheduled_tests',async (req,res)=>{

  const current_Date = get_Current_Date();
  const query="SELECT PT.PT_id, P.Name as P_Name, D.Name as D_Name, T.Name as T_Name, P.Patient_id, D.Doctor_id,Scheduled_Date FROM Patient as P, Doctor as D, Test as T, PrescribedTests as PT WHERE (PT.Patient_id,PT.Doctor_id,PT.Test_id) = (P.Patient_id,D.Doctor_id,T.Test_id) AND PT.Scheduled_Date is NOT NULL AND DATE(Scheduled_Date) >= ?"
  db.query(query,[dDate],(err,result)=>{
    console.log(result)
    console.log(err)
    if(err)
    {
      res.status(300).send(result);
    }
    else 
    {
            formattedResult = result.map((row) => {
              const formattedScheduledDate = update_Current_Date(row.Scheduled_Date);
              return {
                ...row,
                Scheduled_Date: formattedScheduledDate,
              };
            });
            res.status(200).send(formattedResult)
            console.log(formattedResult);
        
    }

  });
});

router.get('/completed_tests',async (req,res)=>{

  const current_Date = get_Current_Date();
  const query="SELECT PT.PT_id, P.Name as P_Name, D.Name as D_Name, T.Name as T_Name, P.Patient_id, D.Doctor_id,Scheduled_Date FROM Patient as P, Doctor as D, Test as T, PrescribedTests as PT WHERE (PT.Patient_id,PT.Doctor_id,PT.Test_id) = (P.Patient_id,D.Doctor_id,T.Test_id) AND PT.Scheduled_Date is NOT NULL AND DATE(Scheduled_Date) < ?"
  const query1="SELECT PT.PT_id, P.Name as P_Name, T.Name as T_Name, P.Patient_id,Scheduled_Date FROM Patient as P, Test as T, PrescribedTests as PT WHERE (PT.Patient_id,PT.Test_id) = (P.Patient_id,T.Test_id) AND PT.Scheduled_Date is NOT NULL AND PT.Doctor_id is NULL AND DATE(Scheduled_Date) < ?"
  db.query(query,[dDate],(err,result)=>{
    console.log(result)
    console.log(err)
    if(err)
    {
      res.status(300).send(result);
    }
    else 
    {
      
      formattedResult = result.map((row) => {
        const formattedScheduledDate = update_Current_Date(row.Scheduled_Date);
        return {
          ...row,
          Scheduled_Date: formattedScheduledDate,
        };
      });
      res.status(200).send(formattedResult)
      console.log(formattedResult);
    }

  });
});

router.get('/bookAppointment/getslots/:date/:Docid',async (req,res)=>{
    const date=req.params.date;
    const docid=req.params.Docid
    console.log(date);
    console.log(docid)
    const data = [
      { Slot: "9:00-9:30" },
      { Slot: "9:30-10:00" },
      { Slot: "10:00-10:30" },
      { Slot: "10:30-11:00" },
      { Slot: "11:00-11:30" },
      { Slot: "11:30-12:00" }
    ];
    let Current_Date = get_Current_Date();
    console.log(Current_Date)
    const query="SELECT DISTINCT Slot FROM Appointment where DATE(Scheduled_Date) = ? AND Doctor_id = ?"
    db.query(query,[date,docid],(err,result)=>{
        
      console.log(result)
        if(Current_Date>date+" 09:00:00") result.push({ Slot: "9:00-9:30"}); 
        if(Current_Date>date+" 09:30:00") result.push({ Slot: "9:30-10:00"}); 
        if(Current_Date>date+" 10:00:00") result.push({ Slot: "10:00-10:30"}); 
        if(Current_Date>date+" 10:30:00") result.push({ Slot: "10:30-11:00"}); 
        if(Current_Date>date+" 11:00:00") result.push({ Slot: "11:00-11:30"}); 
        if(Current_Date>date+" 11:30:00") result.push({ Slot: "11:30-12:00"}); 
        
        const difference = data.filter(item => {
          return !result.some(otherItem => item.Slot === otherItem.Slot);
        });
        console.log(difference);
        console.log(err)
        res.send(difference)
        
    });
});

router.post('/bookAppointment/book', async (req, res) => {

  try {
      let { Patient_id,Doctor_id,Scheduled_Date,Slot,Email,DocName,status } = req.body;
      
      let date=Scheduled_Date;
      let Booking_Date = get_Current_Date();
      if(Slot === "9:00-9:30" )       Scheduled_Date = Scheduled_Date + ' 09:00:00'; 
      else if(Slot === "9:30-10:00")  Scheduled_Date = Scheduled_Date + ' 09:30:00';
      else if(Slot === "10:00-10:30") Scheduled_Date = Scheduled_Date + ' 10:00:00'; 
      else if(Slot === "10:30-11:00") Scheduled_Date = Scheduled_Date + ' 10:30:00'; 
      else if(Slot === "11:00-11:30") Scheduled_Date = Scheduled_Date + ' 11:00:00'; 
      else if(Slot === "11:30-12:00") Scheduled_Date = Scheduled_Date + ' 11:30:00';
      //let deets;
      await db.query("INSERT INTO Appointment(Patient_id,Doctor_id,Scheduled_Date,Booking_Date,Slot) VALUES (?,?,?,?,?)",[Patient_id,Doctor_id,Scheduled_Date,Booking_Date,Slot],  (err, result)=>{
          if(err) {
            res.status(300).send(result);
            console.log(err)
          }
          else 
          {
            console.log(result)
            res.status(200).send(result);
            db.query("SELECT * from Patient where Patient_id = ?",[Patient_id],(err1,result1)=>{
              if(!err1){
                 if(result1.length===1)
                 {
                    const deets1="Greetings Mr/Mrs."+result1[0].Name+",\n\n                        This mail is from the frontdesk of CHAVY Hospitals to inform you that your appointment with Dr."+DocName+" has been scheduled on "+date+" from "+Slot+".\n\nSo, we request you to be there on time.\n\nAppointment details:\n\nAppointment ID: "+result.insertId+"\nDoctor Name: Dr."+DocName+"\nAppointment Date: "+date+"\nSlot: "+Slot+"\n\n\nSincerely,\nFront Desk Team";
                    const deets= "Greetings Dr."+DocName+",\n\n                        This mail is from the frontdesk to inform you that an appointment for Mr/Mrs."+result1[0].Name+" [Patient ID: "+Patient_id+"] has been scheduled with you from " + Slot + " on "+date +".Appointment details:\n\nAppointment Date: "+date+"\nAppointment Slot: "+Slot+"\n\nFor more details, please check your dashboard.\n\n\nSincerely,\nFront Desk Team"
                    console.log(result1[0].Mail)
                    sendEmail(result1[0].Mail,"Appointment Confirmation",deets1).then(response=>{
                      console.log(response.message)
                    }).catch(err=>console.log(err.message))
                    sendEmail(Email,"Appointment Details",deets).then(response=>{
                      console.log(response.message)
                    }).catch(err=>console.log(err.message))
                 }  
              }
            })
          // const deets="Greetings Dr."+DocName+",\n\n                        This mail is from the frontdesk to inform you that an appointment for [Patient ID: "+Patient_id+"] has been scheduled with you from " + Slot + " on "+date +".\n\nAppointment Date: "+date+"\nAppointment Slot: "+Slot+"\n\nFor more details, please check your dashboard.\n\n\nSincerely,\nFront Desk Team"
           
        }
  });
      

  } catch (error) {
      console.log("error1")
      console.error(error);
      res.status(500).send('Server error');
  }
});

router.post('/getavailability', async (req, res) => {

  try {
      const newDate= req.body.date;
      const Current_date = get_Current_Date();
      console.log(newDate);
      console.log(dDate);
       await db.query("SELECT Count(*) as count_limit FROM PrescribedTests WHERE DATE(Scheduled_Date) = ?",[newDate],  (err, result)=>{
          if(err) {
            res.status(401).send(result);
            console.log(err)
          }
          else 
          {
            if(newDate < dDate || result[0].count_limit >= 20 )
            {
              res.status(200).send("No");
            }
            else
            {
              res.status(200).send("Yes");
              console.log(result);
            }
          }
        }
      );
      

  } catch (error) {
      console.log("error1")
      console.error(error);
      res.status(500).send('Server error');
  }
});

router.post('/schedule_test', async (req, res) => {

  try {
      const { date,id } = req.body;
       
       await db.query("UPDATE PrescribedTests SET Scheduled_Date = ? WHERE PrescribedTests.PT_id = ?",[date, id],  (err, result)=>{
          if(err) {
            res.status(300).send(result);
            console.log(err)
          }
          else 
          {
            res.status(200).send(result);
            console.log(result);
            db.query("SELECT T.Name as T_Name,D.Name as D_Name,P.Name as P_Name,DATE(Scheduled_date) as Date,Mail from PrescribedTests as PT,Patient as P,Doctor as D,Test as T where PT.PT_id= ? AND PT.Patient_id=P.Patient_id AND PT.Doctor_id=D.Doctor_id AND T.Test_id=PT.Test_id",[id],(err1,result1)=>{
               if(!err1)
               {
                const deets="Greetings Mr/Mrs."+result1[0].P_Name+",\n\n                        This mail is from the frontdesk of CHAVY Hospitals to inform you that Dr."+result1[0].D_Name+" has prescribed a "+result1[0].T_Name+" and it has been scheduled on "+result1[0].Date+".\n\nSo, we request you to be there on time.\n\nTest Details:\n\nTest Name: "+result1[0].T_Name+"\nScheduled Date: "+result1[0].Date+"\nPrescribed by: "+result1[0].D_Name+"\n\n\nSincerely,\nFront Desk Team"
                sendEmail(result1[0].Mail,"Test Details",deets).then(response=>{
                console.log(response.message)
                }).catch(err=>console.log(err.message))
               }
               else console.log(err1)
            })
            
          }
        }
      );
      

  } catch (error) {
      console.log("error1")
      console.error(error);
      res.status(500).send('Server error');
  }
});

router.get('/admitants',async (req,res)=>{
  
  const query="SELECT * FROM Patient where Patient_id not in (SELECT Patient_id FROM Stay) ORDER BY Registration_Date DESC"
  const query1="SELECT * FROM Patient where Patient_id in (SELECT Patient_id FROM Stay) ORDER BY Registration_Date DESC"
  let final = [];
  let formattedResult=[];
  let formattedResult1=[];
  db.query(query,(err,result)=>{
      //console.log(result);
      if(err) 
      {
        //console.log(err)
        res.status(300).send(result);
      }
      else
      {
         if(result.length>0){
          formattedResult = result.map((row) => {
          const formattedScheduledDate = update_Current_Date(row.Registration_Date);
          return {
            ...row,
            Registration_Date: formattedScheduledDate,
            Admit_Status: "Admit",
          };
        });
       }  
            //res.status(200).send(formattedResult)
           // console.log(formattedResult)
       
      }
      db.query(query1,(err1,result1)=>{
         //console.log(err1)
        // console.log(result1)
         if(!err1)
         {
              if(result1.length>0)
              {
                    formattedResult1 = result1.map((row) => {
                    const formattedScheduledDate = update_Current_Date(row.Registration_Date);
                    return {
                      ...row,
                      Registration_Date: formattedScheduledDate,
                      Admit_Status: "Discharge",
                    };
                  });
              }
              //console.log(formattedResult1)
              //else final=formattedResult;     
         }
         else
         {
             res.status(300).send(result1);
         }
         final=formattedResult.concat(formattedResult1);
         res.status(200).send(final);
         console.log(final);
      })
      //console.log(formattedResult)
      
     

      
  });
  
});

router.get('/:Patient_id/Admit', async (req, res) => {

  try {
      const id= req.params.Patient_id;
      
       await db.query("SELECT * FROM Room WHERE Rem_capacity > 0 ORDER BY Rem_capacity DESC LIMIT 1",  (err, result)=>{
          if(result.length === 0) {
            res.status(200).send([{Room_no: "-1"}]);
            console.log(err)
          }
          else 
          {
            const room = result[0].Room_no;
            let rem_capacity = result[0].Rem_capacity;
            rem_capacity = rem_capacity - 1;
            res.status(200).send(result);
             db.query("INSERT INTO Stay VALUES (?,?)", [id,room], (err1, result1)=>{
              if(err1) res.status(401).send(result1);
            })
             db.query("UPDATE Room SET Rem_capacity = ? WHERE Room_no = ?", [rem_capacity,room], (err2, result2)=>{
              if(err2) res.status(401).send(result2);
            })
          }
        }
     
    );

  } catch (error) {
    console.log("error1")
    console.error(error);
    res.status(500).send('Server error');
}
});

router.get('/:Patient_id/Discharge', async (req, res) => {

  try {
      const id= req.params.Patient_id;
      
       await db.query("SELECT * FROM Stay,Room WHERE Patient_id = ? AND Room.Room_no=Stay.Room_no", [id], (err, result)=>{

            let room = result[0].Room_no;
             db.query("DELETE FROM Stay WHERE Patient_id = ? AND Room_no = ?", [id,room], (err1, result1)=>{
              if(err1) res.status(401).send(result1);
            })
             db.query("SELECT Rem_capacity FROM Room WHERE Room_no = ?", [room], (err3, result3)=>{
                if(err3) res.status(401).send(result3);
                else
                 {
                     let rem_capacity = result3[0].Rem_capacity;
                     rem_capacity = rem_capacity + 1;
                     db.query("UPDATE Room SET Rem_capacity = ? WHERE Room_no = ?", [rem_capacity,room], (err2, result2)=>{
                       if(err2) res.status(401).send(result2);
                     })
                }
              })
              console.log(result);
              res.status(200).send(result);
        });

  } catch (error) {
    console.log("error1")
    console.error(error);
    res.status(500).send('Server error');
}
});


module.exports = router;