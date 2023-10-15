import React, { useState} from 'react'
import axios from 'axios';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.css';
import { useNavigate } from 'react-router';
function PatientReg() {
  
  const [Name,setname]=useState("")
  const [Address,setaddress]=useState("")
  const [Phone,setphone]=useState("")
  const [Mail,setmail]=useState("")
  const [Gender,setgender]=useState("")
  const [DOB,setdob]=useState("")
  const [validmobile,setvalidmobile]=useState(true)
  const [validemail,setvalidemail]=useState(true)
  const navigate=useNavigate();
  // const handleEmail=()=>{
  //   set
  //   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if(!emailPattern.test(Mail))
  //   {
  //       setvalidemail(false)
  //       return;
  //   }
  // }
  const handleSubmit=()=>{

    if(!Name || !Address || !Phone || !Mail || !Gender || !DOB)
    {
      toast.error("Please fill all the fields");
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/
    const mobilePattern = /^\d{10}$/;
    //regex.test(String(email).toLowerCase());
   if(!emailPattern.test(Mail))
   {
     setvalidemail(false)
     if(!mobilePattern.test(Phone))
     {
       setvalidmobile(false);
       return; 
     }
     else setvalidmobile(true);
     return;
   }
   else
   {
     setvalidemail(true);
   }
   if(!mobilePattern.test(Phone))
   {
       setvalidmobile(false);
       return; 
   }
   else setvalidmobile(true);
   
    axios.post("http://localhost:3001/Frontdesk/patient_regist",{Name,Address,Phone,Mail,Gender,DOB}).then((response)=>{
         
           if(response.status===200) 
           {
             toast.success("Patient registeration successful\nPatient ID: "+response.data.insertId,{autoClose:false});
             navigate("/Frontdesk")
           }
            
    });
                
  };
  return (
    <div class="outer-box">
<h2>Patient Registration</h2>
  
  <label htmlFor="name">Patient's Name</label>
  <input type="text" id="name" value={Name} onChange={(event) => setname(event.target.value)} />
  <label htmlFor="phone">Contact Number</label>
  <input type="tel" id="phone" value={Phone} onChange={(event) => setphone(event.target.value)} />
  {!validmobile && (<div style={{color:"red"}}>Please enter a valid mobile number</div>)}
  <label htmlFor="address">Address</label>
  <textarea id="address" name="address" rows="3" cols="50" autoComplete="address" onChange={(event) => setaddress(event.target.value)}></textarea>

  <label htmlFor="email">E-mail ID</label>
  <input type="email" id="email" value={Mail} onChange={(event) => setmail(event.target.value)} />
  {!validemail && (<div style={{color:"red"}}>Please enter a valid Email ID</div>)}
  <label>Gender</label>
    <select onChange={(event) => setgender(event.target.value)}>
      <option>---Select Gender---</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
      <option value="Others">Others</option>
    </select>
  <label htmlFor="dob">Date of Birth</label>
  <input type="date" id="dob" onChange={(event) => setdob(event.target.value)} />
<button class="save-button" onClick={handleSubmit}>Register</button> 
<button class="save-button" onClick={()=>{navigate('/Frontdesk')}}>Go Back</button>

</div>
 
  )
}

export default PatientReg;
