const express = require("express");
const router = express.Router();
const mysql = require("mysql");


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
  const Registration_date = dDate+" "+dtime;
  return Registration_date;
}

router.get('/unscheduled_treatments',async (req,res)=>{

  const query="SELECT U.U_id, P.Name as P_Name, D.Name as D_Name, T.Name as T_Name, P.Patient_id, D.Doctor_id FROM Patient as P, Doctor as D, Treatment as T, Undergoes as U WHERE (U.Patient_id,U.Doctor,U.Treatment_id) = (P.Patient_id,D.Doctor_id,T.Treatment_id) AND U.Scheduled_Date is NULL"
  //const query1="SELECT U.U_id, P.Name as P_Name, T.Name as T_Name, P.Patient_id FROM Patient as P, Treatment as T, Undergoes as U WHERE (U.Patient_id,U.Treatment_id) = (P.Patient_id,T.Treatment_id) AND U.Scheduled_Date is NULL AND U.Doctor is NULL"
  db.query(query,(err,result)=>{
    console.log(result)
    console.log(err)
    if(err)
    {
      res.status(300).send(result);
    }
    else 
    {
      console.log(result);
      res.status(200).send(result);
    }

  });
});

router.get('/scheduled_treatments',async (req,res)=>{

  const current_Date = get_Current_Date();
  const query="SELECT U.U_id, P.Name as P_Name, D.Name as D_Name, T.Name as T_Name, P.Patient_id, D.Doctor_id,Scheduled_Date,Slot FROM Patient as P, Doctor as D, Treatment as T, Undergoes as U WHERE (U.Patient_id,U.Doctor,U.Treatment_id) = (P.Patient_id,D.Doctor_id,T.Treatment_id) AND U.Scheduled_Date is NOT NULL AND DATE(Scheduled_Date) >= ?"
  //const query1="SELECT U.U_id, P.Name as P_Name, T.Name as T_Name, P.Patient_id,Scheduled_Date,Slot FROM Patient as P, Treatment as T, Undergoes as U WHERE (U.Patient_id,U.Treatment_id) = (P.Patient_id,T.Treatment_id) AND U.Scheduled_Date is NOT NULL AND U.Doctor is NULL AND DATE(Scheduled_Date) >= ?"
  
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

router.get('/completed_treatments',async (req,res)=>{

  //const current_Date = get_Current_Date();
  const query="SELECT U.U_id, P.Name as P_Name, D.Name as D_Name, T.Name as T_Name, P.Patient_id, D.Doctor_id,Scheduled_Date,Slot FROM Patient as P, Doctor as D, Treatment as T, Undergoes as U WHERE (U.Patient_id,U.Doctor,U.Treatment_id) = (P.Patient_id,D.Doctor_id,T.Treatment_id) AND U.Scheduled_Date is NOT NULL AND DATE(Scheduled_Date) < ?"
 // const query1="SELECT U.U_id, P.Name as P_Name, T.Name as T_Name, P.Patient_id,Scheduled_Date,Slot FROM Patient as P, Treatment as T, Undergoes as U WHERE (U.Patient_id,U.Treatment_id) = (P.Patient_id,T.Treatment_id) AND U.Scheduled_Date is NOT NULL AND U.Doctor is NULL AND DATE(Scheduled_Date) < ?"
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

router.get('/treat_slots/:date',async (req,res)=>{
  const date=req.params.date;
  console.log(date);
  const data = [
    { Slot: "14:00-15:00" },
    { Slot: "15:00-16:00" },
    { Slot: "16:00-17:00" },
    { Slot: "17:00-18:00" }
  ];
  let Current_Date = get_Current_Date();
  const query="SELECT DISTINCT Slot FROM Appointment where DATE(Scheduled_Date) = ?"
  db.query(query,[date],(err,result)=>{
      
      if(Current_Date>date+" 14:00:00") result.push({ Slot: "14:00-15:00"}); 
      if(Current_Date>date+" 15:00:00") result.push({ Slot: "15:00-16:00"}); 
      if(Current_Date>date+" 16:00:00") result.push({ Slot: "16:00-17:00"}); 
      if(Current_Date>date+" 17:00:00") result.push({ Slot: "17:00-18:00"});
      
      const difference = data.filter(item => {
        return !result.some(otherItem => item.Slot === otherItem.Slot);
      });
      console.log(difference);
      console.log(err)
      res.send(difference)
      
  });
});


router.post("/treatment_schedule",async(req,res)=>{
  const current_date = get_Current_Date();
  let {U_id,Slot,Scheduled_Date}=req.body
     console.log(U_id);
      if(Slot === "14:00-15:00" )
      {        
           Scheduled_Date = Scheduled_Date + ' 14:00:00';
      }
      else if(Slot === "15:00-16:00")
      {
            Scheduled_Date = Scheduled_Date + ' 15:00:00';
      }
      else if(Slot === "16:00-17:00")
      {
            Scheduled_Date = Scheduled_Date + ' 16:00:00';
      }
      else if(Slot === "17:00-18:00")
      {
            Scheduled_Date = Scheduled_Date + ' 17:00:00';
      }
      

  //let query1 = "SELECT Count(*) as count_limit From PrescribedTests WHERE U_id = ? AND ( DATE(Scheduled_Date) >= ? OR Scheduled_Date is NULL)"
  let query2="UPDATE Undergoes SET Slot = ?,Scheduled_Date = ? WHERE U_id = ?"
 //db.query(query1,[U_id,dDate],(err,result)=>{
   // if(result[0].count_limit == 0)
   // {  
    
        db.query(query2,[Slot,Scheduled_Date,U_id],(err1,result1)=>{
          if(!err1){
              res.status(200).send("Scheduled")
              //console.log(err)
              //console.log(result)
              db.query("SELECT T.Name as T_Name,D.Name as D_Name,P.Name as P_Name,DATE(Scheduled_date) as Date,Slot,Mail from Undergoes as PT,Patient as P,Doctor as D,Treatment as T where PT.U_id= ? AND PT.Patient_id=P.Patient_id AND PT.Doctor=D.Doctor_id AND T.Treatment_id=PT.Treatment_id",[id],(err1,result1)=>{
                if(!err1)
                {
                 const deets="Greetings Mr/Mrs."+result1[0].P_Name+",\n\n                        This mail is from the frontdesk of CHAVY Hospitals to inform you that Dr."+result1[0].D_Name+" has prescribed "+result1[0].T_Name+" and it has been scheduled on "+result1[0].Date +" from "+Slot+".\n\nSo, we request you to be there on time.\n\nTreatment Details:\n\nTreatment Name: "+result1[0].T_Name+"\nScheduled Date: "+result1[0].Date+"\nSlot: "+Slot+"\nPrescribed by: "+result1[0].D_Name+"\n\n\nSincerely,\nFront Desk Team"
                 sendEmail(result1[0].Mail,"Test Details",deets).then(response=>{
                 console.log(response.message)
                 }).catch(err=>console.log(err.message))
 
                }
                else console.log(err1)
             })
          }
        });
//////////    
   
  //

})


module.exports = router;