import React from 'react';
import { useEffect, useState} from 'react';
import axios from 'axios';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faFaceFrown} from '@fortawesome/free-regular-svg-icons'

function TestScheduling()
{
    const [Tests,setTests] =useState([]) 
    const [STests,setSTests] =useState([]) 
    const [CTests,setCTests] =useState([])  
    const loadData = ()=>
    {
        axios.get("http://localhost:3001/Frontdesk/unscheduled_tests").then(response=>{
               setTests(response.data)
               console.log(response.data)
         })
         axios.get("http://localhost:3001/Frontdesk/scheduled_tests").then(response=>{
               setSTests(response.data)
               console.log(response.data)
         })
         axios.get("http://localhost:3001/Frontdesk/completed_tests").then(response=>{
          setCTests(response.data)
          console.log(response.data)
    })
    }
    useEffect(()=>{
         loadData();
    },[]);
   const [showInput,setshowInput]=useState(false)
   const [newdate,setnewdate]=useState("")
   const [testinfo,settestinfo]=useState({})
   const [schedulebutton,setschedulebutton]=useState(false)
   const [showstests,setshowstests]=useState(false)
   const [showctests,setshowctests]=useState(false)
   const handleModalClose=()=>
   {
       setshowInput(false)
       setschedulebutton(false)
       setnewdate("")
   }
   const getavailability=(date)=>
   {
      setnewdate(date);
      console.log(date);
      axios.post("http://localhost:3001/Frontdesk/getavailability",{date}).then(response=>{
          if(response.data==="No") 
          {
            setschedulebutton(false);
            return;
          }
          else if(response.data==="Yes") 
          {
            setschedulebutton(true);
            return;
          }
      })
   }
   const update_date=(date,id,test_name)=>{
  
    axios.post("http://localhost:3001/Frontdesk/schedule_test",{date,id}).then(response=>{
            if(response.status===200)
            {
                setschedulebutton(false)
                setshowInput(false)
                toast.success("Scheduled a "+test_name + " on " + date);
                setTimeout(()=>loadData(), 500)
            }
    })
    return;
   }
   
 
    return(
        <div className='outer-box1'>
      <br></br><br></br>
         {showInput && (
            <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={handleModalClose}>
                &times;
              </span> 
              <div className='outer-box1' style={{backgroundColor:"#bad9e5"}}>
               <h1 style={{fontSize:20,color:"black"}}>Scheduling {testinfo.T_Name} for  {testinfo.P_Name}</h1>
               <br/>
                <label>Select a date</label>
              <input type="date" onChange={(event) => {getavailability(event.target.value)}}/>
              {
                schedulebutton && (<div> <button style={{transform:"scale(1.3)"}} onClick={()=>{update_date(newdate,testinfo.PT_id,testinfo.T_Name)}}>Schedule </button> </div> )
              }
              {
                 newdate && !schedulebutton && (<div style={{fontSize:18,color:"black"}}>No slots available!!<FontAwesomeIcon icon={faFaceFrown}/><br/>Please choose another date</div>)
              }
              </div>
            </div>
          </div>
         )}
          <div className="Table">
         <h2>UnScheduled Tests</h2>
        {
         Tests.length>0 && (
          <table className="table">
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>Test ID</th>
                <th style={{ textAlign: "center" }}>Test Name</th>
                <th style={{ textAlign: "center" }}>Patient ID</th>
                <th style={{ textAlign: "center" }}>Patient Name</th>
                <th style={{ textAlign: "center" }}>Doctor ID</th>
                <th style={{ textAlign: "center" }}>Doctor Name</th>
                <th style={{ textAlign: "center" }}>Click to Schedule</th>
              </tr>
            </thead>
             
              {Tests.map((item, index) => {
                return (
                  <tr key={index}>
                    <th>{item.PT_id}</th>
                    <td>{item.T_Name}</td>
                    <td>{item.Patient_id}</td>
                    <td>{item.P_Name}</td>
                    <td>{item.Doctor_id}</td> 
                    <td>{item.D_Name}</td> 
                    <td>
                      <div> <button  onClick={()=>{setshowInput(true); settestinfo({PT_id: item.PT_id,T_Name: item.T_Name,D_Name: item.D_Name,P_Name: item.P_Name});setTimeout(()=>loadData(), 500);}}>
                    Schedule
                     </button> </div>  
                    </td>
                  </tr>
                );
              })}
             
          </table>)
        }
        {
          Tests.length===0 && (<div>Phew!!No Tests to schedule :)</div>)
        }
      </div>
      <br></br>
      {!showstests&&(<button onClick={()=>{setshowstests(true);}}>Show all Scheduled Tests</button>)}
      {showstests&&(<button onClick={()=>{setshowstests(false);}}>Hide all Scheduled Tests</button>)}
      {!showctests&&(<button onClick={()=>{setshowctests(true);}}>Show all Completed Tests</button>)}
      {showctests&&(<button onClick={()=>{setshowctests(false);}}>Hide all Completed Tests</button>)}
      
     {showstests &&( <div className="Table">
         <h2><br/>Scheduled Tests</h2>
        { STests.length>0 && (
          <table className="table">
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>Test ID</th>
                <th style={{ textAlign: "center" }}>Test Name</th>
                <th style={{ textAlign: "center" }}>Patient ID</th>
                <th style={{ textAlign: "center" }}>Patient Name</th>
                <th style={{ textAlign: "center" }}>Doctor ID</th>
                <th style={{ textAlign: "center" }}>Doctor Name</th>
                <th style={{ textAlign: "center" }}>Scheduled Date</th>
              </tr>
            </thead>
             
              {STests.map((item, index) => {
                return (
                  <tr key={index}>
                    <th>{item.PT_id}</th>
                    <td>{item.T_Name}</td>
                    <td>{item.Patient_id}</td>
                    <td>{item.P_Name}</td>
                    <td>{item.Doctor_id}</td> 
                    <td>{item.D_Name}</td> 
                    <td>{item.Scheduled_Date}</td> 
                    <td>
    
                    </td>
                  </tr>
                );
              })}
             
          </table>)
        }
        {
          STests.length===0 && (<div>Phew!! No tests are scheduled at the moment :)</div>)
        }
      </div>)
}
      <br></br>
      {showctests && (<div className="Table">
         <h2><br/>Completed Tests</h2>
        {  CTests.length>0 && (
          <table className="table">
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>Test ID</th>
                <th style={{ textAlign: "center" }}>Test Name</th>
                <th style={{ textAlign: "center" }}>Patient ID</th>
                <th style={{ textAlign: "center" }}>Patient Name</th>
                <th style={{ textAlign: "center" }}>Doctor ID</th>
                <th style={{ textAlign: "center" }}>Doctor Name</th>
                <th style={{ textAlign: "center" }}>Scheduled Date</th>
              </tr>
            </thead>
             
              {CTests.map((item, index) => {
                return (
                  <tr key={index}>
                    <th>{item.PT_id}</th>
                    <td>{item.T_Name}</td>
                    <td>{item.Patient_id}</td>
                    <td>{item.P_Name}</td>
                    <td>{item.Doctor_id}</td> 
                    <td>{item.D_Name}</td> 
                    <td>{item.Scheduled_Date}</td> 
                    <td>
    
                    </td>
                  </tr>
                );
              })}
             
          </table>)
        }
        {
          CTests.length===0 && (<div>No tests are completed</div>)
        }
      </div>)}

        </div>
    )






}

export default TestScheduling;