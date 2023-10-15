const express = require("express");
const router = express.Router();
const mysql = require("mysql");


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

router.get('/byid/:Doctor_id',async (req,res)=>{
    const id1 = req.params.Doctor_id
    //console.log(id1.Doctor_id)
    //console.log(req.params.id)
    const query="SELECT * FROM Users_ where Type='Doctor' AND UserID =?"
    db.query(query,[id1],(err,result)=>{
        res.send(result)
        console.log(result)
        console.log(err)
    });
});

router.get('/byid_getappointments/:id',async (req,res)=>{
  const id=req.params.id
  const query="SELECT * FROM Appointment as A,Patient as P where A.Doctor_id =? AND P.Patient_id=A.Patient_id ORDER BY Scheduled_Date"
  db.query(query,[id],(err,result)=>{
    const formattedResult = result.map((row) => {
      const formattedScheduledDate = update_Current_Date(row.Scheduled_Date);
      return {
        ...row,
        Scheduled_Date: formattedScheduledDate,
      };
    });
      res.send(formattedResult)
      console.log(formattedResult)
      console.log(err)
  });
});

router.get('/byid/:id/Appointments/Past',async (req,res)=>{
  const id=req.params.id
  let Current_Date = get_Current_Date();
  const query="SELECT * FROM Appointment as A,Patient as P where A.Doctor_id =? AND P.Patient_id=A.Patient_id AND A.Scheduled_Date < ? ORDER BY A.Scheduled_Date"
  db.query(query,[id,Current_Date],(err,result)=>{
      const formattedResult = result.map((row) => {
      const formattedScheduledDate = update_Current_Date(row.Scheduled_Date);
      return {
        ...row,
        Scheduled_Date: formattedScheduledDate,
      };
    });
      res.send(formattedResult)
      console.log(formattedResult)
      console.log(err)
  });
});

router.get('/byid/:id/Appointments/Future',async (req,res)=>{
  const id=req.params.id
  let Current_Date = get_Current_Date();
  console.log(Current_Date);
  const query="SELECT * FROM Appointment as A,Patient as P where A.Doctor_id =? AND P.Patient_id=A.Patient_id AND A.Scheduled_Date >= ? ORDER BY A.Scheduled_Date"
  db.query(query,[id,Current_Date],(err,result)=>{
    const formattedResult = result.map((row) => {
      const formattedScheduledDate = update_Current_Date(row.Scheduled_Date);
      return {
        ...row,
        Scheduled_Date: formattedScheduledDate,
      };
    });
      res.send(formattedResult)
      console.log(formattedResult)
      console.log(err)
  });
});

router.get('/byid_getpatients/:id',async (req,res)=>{
  const id=req.params.id
  const query="SELECT DISTINCT P.Patient_id,P.* FROM Appointment as A,Patient as P where A.Doctor_id =? AND P.Patient_id=A.Patient_id"
  db.query(query,[id],(err,result)=>{
      res.send(result)
      console.log(result)
      console.log(err)
  });
});


router.get('/byid_getcount/:Doctor_id',async (req,res)=>{
  const id=req.params.Doctor_id
  let Current_Date = get_Current_Date();
  //console.log(Current_Date)
  const query="SELECT count(*) as count_patient FROM Appointment where Scheduled_Date >= ? AND Doctor_id = ?"
  db.query(query,[Current_Date,id],(err,result)=>{
      res.send(result)
      console.log(result)
      console.log(err)
  });
});

router.post("/prescribe/Test",async(req,res)=>{
  const current_date = get_Current_Date();
  const {Doctor_id,Patient_id,selectedTest}=req.body
  console.log(selectedTest)
  let query1 = "SELECT Count(*) as count_limit From PrescribedTests WHERE Patient_id = ? AND Test_id = ? AND Doctor_id = ? AND ( DATE(Scheduled_Date) >= ? OR Scheduled_Date is NULL)"
  let query2="Insert into PrescribedTests (Patient_id,Test_id,Doctor_id) values(?, ?, ?)"
  db.query(query1,[Patient_id,selectedTest,Doctor_id,dDate],(err,result)=>{
    if(result[0].count_limit == 0)
    {
        db.query(query2,[Patient_id,selectedTest,Doctor_id],(err1,result1)=>{
             if(!err1){
              res.status(200).send("Inserted")
              //console.log(err)
              console.log(result1)
             }
             else console.log(err1)
        });
    }
    else
    {
      res.status(200).send("Present");
    }
  })


})

router.post("/prescribe/Treatment",async(req,res)=>{
  const current_date = get_Current_Date();
  const {Doctor_id,Patient_id,selectedTest}=req.body
  console.log(selectedTest)
  console.log(1)
  let query1 = "SELECT Count(*) as count_limit From Undergoes WHERE Patient_id = ? AND Treatment_id = ? AND Doctor = ? AND ( DATE(Scheduled_Date) >= ? OR Scheduled_Date is NULL)"
  let query2="Insert into Undergoes (Patient_id,Treatment_id,Doctor) values(?, ?, ?)"
  db.query(query1,[Patient_id,selectedTest,Doctor_id,dDate],(err,result)=>{
    console.log(err)
    if(!err){
    if(result.length>0 && result[0].count_limit == 0)
    {
        db.query(query2,[Patient_id,selectedTest,Doctor_id],(err1,result1)=>{
              res.status(200).send("Inserted")
              //console.log(err)
              //console.log(result)
        });
    }
    else
    {
      res.status(200).send("Present");
    }
  }
  })


})

router.get('/patient_history/:Doctor_id',async (req,res)=>{
  const id=req.params.Doctor_id
  //let Current_Date = get_Current_Date();
  //console.log(Current_Date)
  const query="SELECT DISTINCT P.* FROM Appointment as A, Patient as P where A.Patient_id = P.Patient_id AND A.Doctor_id = ?"
  db.query(query,[id],(err,result)=>{
      res.send(result)
      console.log(result)
      console.log(err)
  });
});

router.get('/:Patient_id/Test/results',async (req,res)=>{
  const id=req.params.Patient_id
  //let Current_Date = get_Current_Date();
  //console.log(Current_Date)
  const query="SELECT PT.*,T.Name as T_Name,D.Name as D_Name,P.Name as P_Name FROM PrescribedTests as PT,Test as T, Patient as P, Doctor as D where PT.Patient_id = P.Patient_id AND PT.Doctor_id=D.Doctor_id AND PT.Test_id = T.Test_id AND PT.Patient_id =  ? "
  db.query(query,[id],(err,result)=>{
    console.log(err)
    if(!err){
    if(result.length>0){
      const formattedResult = result.map((row) => {
        const formattedScheduledDate = update_Current_Date(row.Scheduled_Date);
        return {
          ...row,
          Scheduled_Date: formattedScheduledDate,
        };
      });
      console.log(formattedResult)
        res.send(formattedResult)
    }
    else res.send(result)
  }
      
  });
});

router.get('/:Patient_id/Treatment/results',async (req,res)=>{
  const id=req.params.Patient_id
  //let Current_Date = get_Current_Date();
  //console.log(Current_Date)
  const query="SELECT U.*,T.Name as T_Name,D.Name as D_Name,P.Name as P_Name FROM Undergoes as U, Treatment as T,Patient as P, Doctor as D where U.Patient_id = P.Patient_id AND U.Doctor=D.Doctor_id AND U.Treatment_id = T.Treatment_id AND U.Treatment_id = T.Treatment_id AND U.Patient_id =  ? "
  db.query(query,[id],(err,result)=>{
    console.log(err)
    if(!err){
    if(result.length>0){
      const formattedResult = result.map((row) => {
        const formattedScheduledDate = update_Current_Date(row.Scheduled_Date);
        return {
          ...row,
          Scheduled_Date: formattedScheduledDate,
        };
      });
      console.log(formattedResult)
        res.send(formattedResult)
    }
    else res.send(result)
  }
  });
});

router.get('/:Patient_id/Description/results',async (req,res)=>{
  const id=req.params.Patient_id
  //let Current_Date = get_Current_Date();
  //console.log(Current_Date)
  console.log(1)
  const query="SELECT A.*,D.Name as D_Name,P.Name as P_Name FROM Appointment as A,Patient as P, Doctor as D where A.Patient_id = P.Patient_id AND A.Doctor_id=D.Doctor_id AND A.Patient_id =  ? AND A.Description is NOT NULL"
  db.query(query,[id],(err,result)=>{
    console.log(err)
    if(!err){
    if(result.length>0){
      const formattedResult = result.map((row) => {
        const formattedScheduledDate = update_Current_Date(row.Scheduled_Date);
        return {
          ...row,
          Scheduled_Date: formattedScheduledDate,
        };
      });
      console.log(formattedResult)
        res.send(formattedResult)
    }
    else res.send(result)
  }
  });
});

router.post("/postremarks/:id",async(req,res)=>{

    const id=req.params.id;
    const remarks = req.body.remarks
    const query="UPDATE Appointment SET `Description` = ? Where Appointment_id=?";
    db.query(query,[remarks,id],(err,result)=>{
      if(!err)
      {
        res.status(200).send("Remarks added successfully");
      }
    });
})
module.exports = router;