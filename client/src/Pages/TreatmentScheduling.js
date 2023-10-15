import React from 'react';
import { useEffect, useState} from 'react';
import axios from 'axios';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faFaceFrown} from '@fortawesome/free-regular-svg-icons'

function TreatmentScheduling()
{
    const [Treatments,setTreatments] =useState([]) 
    const [STreatments,setSTreatments] =useState([]) 
    const [CTreatments,setCTreatments] =useState([])  
    const [showstests,setshowstests]=useState(false)
   const [showctests,setshowctests]=useState(false)
    const loadData = ()=>
    {
        axios.get("http://localhost:3001/Fdesk/unscheduled_treatments").then(response=>{
               setTreatments(response.data)
               console.log(response.data)
         })
         axios.get("http://localhost:3001/Fdesk/scheduled_treatments").then(response=>{
               setSTreatments(response.data)
               console.log(response.data)
         })
         axios.get("http://localhost:3001/Fdesk/completed_treatments").then(response=>{
          setCTreatments(response.data)
          console.log(response.data)
    })
    }
    useEffect(()=>{
         loadData();
    },[]);

    const [showInput,setshowInput] =useState(false)
    const [selectedDate,setselectedDate] =useState("")
    const [selectedSlot,setselectedSlot] =useState("")
    const [showslots,setshowslots] = useState(false)
    const [free_slots,setfree_slots] =useState([])
    const [tinfo,settinfo] =useState({})
    const handleModalClose =()=>{
      setshowInput(false);
      setshowslots(false);
      setselectedSlot(false);
    }
  
    const schedule =()=>{
      
      if(!selectedSlot) 
      {
        toast.error("Please choose a valid slot")
        return;
      }

      axios.post("http://localhost:3001/Fdesk/treatment_schedule",{U_id: tinfo.U_id,Slot: selectedSlot,Scheduled_Date: selectedDate}).then(response=>{
        if(response.status===200) 
        {
          setshowInput(false);
          setshowslots(false);
          setselectedSlot(false);
          toast.success("Scheduled "+tinfo.T_Name+" from "+selectedSlot + " for "+tinfo.P_Name+" prescribed by Dr."+tinfo.D_Name)
          setTimeout(()=>loadData(), 500);
        }
      })

        
    }
    const getslots =(date)=>{
       setselectedDate(date);
       axios.get(`http://localhost:3001/Fdesk/treat_slots/${date}`).then(response=>{
             if(response.status===200)setfree_slots(response.data)
       }).catch((err)=>{
           toast.error("Server Error")
       })
       setshowslots(true)
       return;
    }

    const slots=[
      {Slot: "9:00-9:30"},
      {Slot: "9:30-10:00"},
      {Slot: "10:00-10:30"},
      {Slot: "10:30-11:00"},
      {Slot: "11:00-11:30"},
      {Slot: "11:30-12:00"},

    ]




    return(
        <div className='outer-box1'>
      <br></br><br></br>
      {showInput && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleModalClose}>
              &times;
            </span> 
            <div className='outer-box1'>
            <h1 style={{fontSize:20,color:"black"}}> Scheduling {tinfo.T_Name} with Dr.{tinfo.D_Name} for {tinfo.P_Name}<br></br></h1>
             <label>Select Date:</label>
            <input type="date" onChange={(event) => {getslots(event.target.value);}}/>
            <br /> 
                {showslots && (
                    <div>
                       <h1 style={{fontSize:20,color:"black"}}>Available Slots:<br></br></h1>
                       {free_slots.length!==0 && (free_slots.map((val,k)=>{
                        return(
                            <div>
                                  { selectedSlot===val.Slot &&
                                    (<button style={{backgroundColor:"#053348",color:"white",transform:"scale(1.15)"}}onClick={()=>{setselectedSlot(val.Slot);}}>{val.Slot} </button>)
                                  }
                                  { selectedSlot!==val.Slot &&
                                    (<button onClick={()=>{setselectedSlot(val.Slot);}}>{val.Slot} </button>)
                                  }
                            </div>
                        )
                       })
                       )}
                       {!(free_slots.length) && (
                       <div style={{fontSize:18,color:"black"}}>No slots available!!<FontAwesomeIcon icon={faFaceFrown}/><br/>Please choose another date</div>
                       )}
                      <br/>
                    </div>
                )}
             <div> <button style={{transform:"scale(1.3)"}}onClick={schedule}>Schedule </button> </div> 
             </div>
          </div>
        </div>
      )}
          <div className="Table">
         <h2>UnScheduled Treatments</h2>
        {
         Treatments.length>0 && (
          <table className="table">
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>Treatment ID</th>
                <th style={{ textAlign: "center" }}>Treatment Name</th>
                <th style={{ textAlign: "center" }}>Patient ID</th>
                <th style={{ textAlign: "center" }}>Patient Name</th>
                <th style={{ textAlign: "center" }}>Doctor ID</th>
                <th style={{ textAlign: "center" }}>Doctor Name</th>
                <th style={{ textAlign: "center" }}>Click to Schedule</th>
              </tr>
            </thead>
             
              {Treatments.map((item, index) => {
                return (
                  <tr key={index}>
                    <th>{item.U_id}</th>
                    <td>{item.T_Name}</td>
                    <td>{item.Patient_id}</td>
                    <td>{item.P_Name}</td>
                    <td>{item.Doctor_id}</td> 
                    <td>{item.D_Name}</td> 
                    <td>
                       <div> <button onClick={()=>{setshowInput(true);settinfo({U_id: item.U_id,T_Name:item.T_Name,P_Name: item.P_Name,D_Name: item.D_Name})}}>
                        Schedule
                     </button> </div>  
                    </td>
                  </tr>
                );
              })}
             
          </table>)
        }
        {
          Treatments.length===0 && (<div>Phew!! No Treatments to schedule :)</div>)
        }
      </div>
      <br></br>
      <br></br>
      {!showstests&&(<button onClick={()=>{setshowstests(true);}}>Show all Scheduled Treatments</button>)}
      {showstests&&(<button onClick={()=>{setshowstests(false);}}>Hide all Scheduled Treatments</button>)}
      {!showctests&&(<button onClick={()=>{setshowctests(true);}}>Show all Completed Treatments</button>)}
      {showctests&&(<button onClick={()=>{setshowctests(false);}}>Hide all Completed Treatments</button>)}
     {showstests&&( <div className="Table">
         <h2><br/>Scheduled Treatments</h2>
        { STreatments.length>0 && (
          <table className="table">
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>Treatment ID</th>
                <th style={{ textAlign: "center" }}>Treatment Name</th>
                <th style={{ textAlign: "center" }}>Patient ID</th>
                <th style={{ textAlign: "center" }}>Patient Name</th>
                <th style={{ textAlign: "center" }}>Doctor ID</th>
                <th style={{ textAlign: "center" }}>Doctor Name</th>
                <th style={{ textAlign: "center" }}>Scheduled Time(YYYY-MM-DD)</th>
              </tr>
            </thead>
             
              {STreatments.map((item, index) => {
                return (
                  <tr key={index}>
                    <th>{item.U_id}</th>
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
          STreatments.length===0 && (<div>Phew!! No treatments are scheduled at the moment :)</div>)
        }
      </div>)}
      <br></br>
      <br></br>
     {showctests && ( <div className="Table">
         <h2><br/>Completed Treatments</h2>
        {  CTreatments.length>0 && (
          <table className="table">
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>Treatment ID</th>
                <th style={{ textAlign: "center" }}>Treatment Name</th>
                <th style={{ textAlign: "center" }}>Patient ID</th>
                <th style={{ textAlign: "center" }}>Patient Name</th>
                <th style={{ textAlign: "center" }}>Doctor ID</th>
                <th style={{ textAlign: "center" }}>Doctor Name</th>
                <th style={{ textAlign: "center" }}>Scheduled Time(YYYY-MM-DD)</th>
              </tr>
            </thead>
             
              {CTreatments.map((item, index) => {
                return (
                  <tr key={index}>
                    <th>{item.U_id}</th>
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
          CTreatments.length===0 && (<div>No treatments are completed till now</div>)
        }
      </div>)}

        </div>
    )

}

export default TreatmentScheduling;