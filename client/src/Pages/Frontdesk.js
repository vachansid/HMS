import React, { useEffect , useState} from 'react'
import { useParams,Link,useNavigate } from 'react-router-dom'
//import axios from 'axios'
//import Patientreg from './PatientReg';

function Frontdesk() {
  const navigate = useNavigate();
  
  return (
    <div className="outer-box1">
      <h2>Front Desk Page</h2>
       <br></br>
       <br></br>
        <button onClick={()=>navigate('./PatientReg') }>Patient Registration</button>
        <br></br>
        <br></br>
        <br></br>
        <button onClick={()=>navigate('./bookAppointment') }>Appointment Booking</button>
        <button onClick={()=>navigate('./TestScheduling') }>Tests Scheduling</button>
        <button onClick={()=>navigate('./RoomAllotment') }>Room Allotment</button>
        <button onClick={()=>navigate('./TreatmentScheduling') }>Treatments Scheduling</button>
    </div>
  )
}

export default Frontdesk
