import React from 'react';
import { useEffect, useState} from 'react';
import axios from 'axios';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faFaceFrown} from '@fortawesome/free-regular-svg-icons'

function Appointment()
{ 
    const [valid,setvalid]=useState(true)
   
    const book=()=>{
      if(!PatientID || !selectedSlot)
      {
         setvalid(false);
         return;
      }
         
         axios.post("http://localhost:3001/Frontdesk/bookAppointment/book",{Patient_id:PatientID,Doctor_id:Docinfo.Doctor_id,Scheduled_Date:date,Slot:selectedSlot,Email:Docinfo.Email,DocName:Docinfo.Name,status:status}).then((response)=>{

              if(response.status===200) 
              {
                setshowInput(false);
                setshowslots(false);
                setselectedSlot(false);
                setPatientID("");
                setvalid(true);
                toast.success("Booked an appointment with Dr."+Docinfo.Name+" from "+selectedSlot)
              }
              else
              {
                
              }
         }).catch(err=>{
          //setvalid(false);
          toast.error("Please select valid options")
         })
   
    }
    const getpatients=()=>{
      axios.get("http://localhost:3001/General/get_patients").then(resp=>{
        setPatientlist(resp.data)
        console.log(resp.data)
      })
    }
    const [DocsList,setDocsList] = useState([]);
    const [showInput,setshowInput] = useState(false);
    const [PatientID,setPatientID] =useState("")
    const [Patientlist,setPatientlist] =useState([])
    const [Docinfo,setDocinfo] =useState({})
    const [status,setstatus]=useState("Yes")
    const [date,setdate]=useState("")
    const [slots,setslots]=useState([])
    const [showslots,setshowslots]=useState(false)
    const [selectedSlot,setselectedSlot] = useState("")
    useEffect(()=>{
        axios.get("http://localhost:3001/Frontdesk/bookAppointment/getdoctors").then((response)=>{
         
            console.log(response)
            setDocsList(response.data)
        });
        getpatients();
    },[]);
    const handlePatientID=(id,name,email)=>
    {
        setshowInput(true);
        setDocinfo({Doctor_id:id,Name:name,Email:email});
    }
    const handleModalClose=()=>
    {
        setshowslots(false);
        setshowInput(false);
        setselectedSlot(false);
    }
    const getslots=(ndate)=>{
        setdate(ndate);
        axios.get(`http://localhost:3001/Frontdesk/bookAppointment/getslots/${ndate}/${Docinfo.Doctor_id}`).then(response=>{
              setslots(response.data)
              console.log(response)
        }).catch((err)=>{
            console.log(err)
        })
        setshowslots(true);
        return;
    }
     return(
        
        <div className="outer-box1">

      <br></br><br></br>
      {showInput && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleModalClose}>
              &times;
            </span> 
            <h1 style={{fontSize:20,color:"black"}}>Booking an appointment with Dr.{Docinfo.Name}<br></br></h1>

             <div className='outer-box2'>
              {!valid && (<div style={{color:"red"}}>Please select valid options</div>)}
              <label>
                Patient*:   <br /> 
                <select onChange={(event) => {setPatientID(event.target.value)}}>
                  <option>---------Select Patient--------</option>
                  {Patientlist.map((value,key)=>{
                    return(<option value={value.Patient_id}>{value.Patient_id}, {value.Name}</option>)
                  })}
                </select>
                {/* <input type="text" onChange={(event) => setPatientID(event.target.value)}/> */}
                 <br /> 
                 Select Date*:
              </label>
            <input type="date" onChange={(event) => {getslots(event.target.value);}}/>
            <br /> 
                {showslots && (
                    <div>
                       <h1 style={{fontSize:20,color:"black"}}>Available Slots:<br></br></h1>
                       {slots.length!==0 && ((slots.map((val,k)=>{
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
                       ))}
                       {!(slots.length) && (
                       <div style={{fontSize:18,color:"black"}}>No slots available!!<FontAwesomeIcon icon={faFaceFrown}/><br/>Please choose another date</div>
                       )}

                    </div>
                )}
                <br/>
            <button style={{transform:"scale(1.3)"}}onClick={()=>{setstatus("Yes");book();}}>Book and Mail Doctor</button>
            </div>
          </div>
        </div>
      )}
      <div className="Table">
         <h2>Our Doctors</h2>
         <br></br>
        {
         DocsList.length>0 && (
          <table className="table">
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>Doctor ID</th>
                <th style={{ textAlign: "center" }}>Name</th>
                <th style={{ textAlign: "center" }}>Specialization</th>
                <th style={{ textAlign: "center" }}>Email</th>
                <th style={{ textAlign: "center" }}>Availability</th>
                <th style={{ textAlign: "center" }}>Click to book Appointment</th>
              </tr>
            </thead>
              {DocsList.map((item, index) => {
                return (
                  <tr key={index}>
                    <th>{item.Doctor_id}</th>
                    <td>{item.Name}</td>
                    <td>{item.Specialization}</td>
                    <td>{item.Email}</td>
                    <td>Every Day, 9AM to 12AM</td> 
                    <td>
                    <div><button onClick={()=>handlePatientID(item.Doctor_id,item.Name,item.Email)}>
                    Book Appointment
                    </button></div>
                    
                    </td>
                  </tr>
                );
              })}
          </table>)
        }
        {
          DocsList.length===0 && (<div style={{fontSize:18,color:"black"}}>No Doctors in the hospital :(</div>)
        }
      </div>
      <br></br>
         
        </div>
     )

}
export default Appointment;