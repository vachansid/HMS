import React, { useEffect , useState} from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import {  toast } from 'react-toastify';
function ShowAppointments() {

  const {Doctor_id,type} = useParams()
  console.log(Doctor_id)
  const [PAppointments,setPAppointments]=useState([])
  const [FAppointments,setFAppointments]=useState([])
  const [aid,setaid] =useState("")
  const [remarks,setremarks]=useState("")
  const [Patient_id,setPid]=useState("")
  const [Patient,setPatient]=useState("")
  const [selectedTest,setselectedTest]=useState("")
  const [tests,settests]=useState([])
  const [type1,settype1]=useState("")
  const [showTestDailog,setshowTestDialog] =useState(false)
  useEffect(()=>{
     show();
  },[]);

  const get1=(type2)=>{
    axios.get(`http://localhost:3001/General/get/${type2}`).then(response=>{
       console.log(response)
       console.log(1)
       settests(response.data)
       console.log(tests)
    });
}
 
  const show=()=>{
     axios.get(`http://localhost:3001/Doctor/byid/${Doctor_id}/Appointments/Past`).then((response)=>{
         setPAppointments(response.data)
         console.log(response.data)
     });
     axios.get(`http://localhost:3001/Doctor/byid/${Doctor_id}/Appointments/Future`).then((response)=>{
      setFAppointments(response.data)
      console.log(response.data)
  });
  }
  const post1=()=>{
     
    //toast.success("Test Prescribed")
    console.log(selectedTest)
    console.log(1)
    if(!selectedTest)
    {
      toast.error("Please select an option");
      return;
    }
    axios.post(`http://localhost:3001/Doctor/prescribe/${type1}`,{ Doctor_id,Patient_id,selectedTest}).then((response)=>{
          
      if(response.status===200)
      {
        if(response.data==="Inserted")
        {
          toast.success(type1+" Prescribed")
        }
        else if(response.data==="Present")
        {
           toast.success("Already Prescribed\nResults will be updated in your dashboard after completion")
        }
      }
      else toast.error("Error in adding the test")
     console.log(response)
   })
   setshowTestDialog(false)

  }
   
    const handleDailogClose=()=>
    {
        setshowTestDialog(false);
    }
    const postremarks=()=>{
        
      if(!remarks)
      { 
        setshowTestDialog(false)
        return;
      }
        axios.post(`http://localhost:3001/Doctor/postremarks/${aid}`,{remarks}).then(response=>{
          console.log(response)
          if(response.status===200) 
          {
            toast.success(response.data);
            setshowTestDialog(false);
          }
        });
    }
  return (
   
    
    <div className='outer-box1'>
        {showTestDailog && (
        <div className="modal">
          <div className="modal-content" style={{width: 500}}>
            <span className="close" onClick={handleDailogClose}>
              &times;
            </span> 
            <div className='outer-box1'>
           {(type1=='Test' || type1=='Treatment') && (
             <label>
               <h1 style={{fontSize:20,color:"black"}}>Prescribe {type1} for {Patient}  <br></br></h1>
              
              <br/>
              <label> Select a {type1}:</label>
       
                <select onChange={(e)=>{setselectedTest(e.target.value)}}>
                <option value="">-----Select a {type1}-----</option>
                {tests.map((item,key)=>
                {
                  if(type1==="Test")return(<option value={item.Test_id}>{item.Name}</option>)
                  if(type1==="Treatment")return(<option value={item.Treatment_id}>{item.Name}</option>)
                })}
                {/* <option value={tests[0].Test_id}>{tests[0].Name}</option> */}
                </select>
            <br /> 
            <button style={{transform:"scale(1.2)"}}onClick={post1}>Prescribe</button>
            </label>
           )}
             {
               type1=="remarks" && (
                  <div>
                     <h1 style={{fontSize:20,color:"black"}}> <br/> Prescription for appointment with {Patient} <br/><br/></h1>
                    
                  <textarea rows="6" cols="35" name="my-input" placeholder="Add your remarks here" onChange={(e)=>setremarks(e.target.value)}></textarea>
                  <br/><br/>
                  <button style={{transform:"scale(1.2)"}}onClick={postremarks}>Submit</button>
                 </div>
               )
             }
            </div>
          </div>
        </div>
      )}
      <br/>
      <div className="Table">
         <h2>Future Appointments</h2>
        {
         FAppointments.length>0 && (
          <table className="table">
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>Appointment ID</th>
                <th style={{ textAlign: "center" }}>Patient ID</th>
                <th style={{ textAlign: "center" }}>Patient Name</th>
                <th style={{ textAlign: "center" }}>Scheduled Time(YYYY-MM-DD)</th>
                <th style={{ textAlign: "center" }}>Prescribe Test</th>
                <th style={{ textAlign: "center" }}>Prescribe Treatment</th>
                <th style={{ textAlign: "center" }}>Add Prescription</th>
              </tr>
            </thead>
              {FAppointments.map((item, index) => {
                return (
                  <tr key={index}>
                    <th>{item.Appointment_id}</th>
                    <td>{item.Patient_id}</td>
                    <td>{item.Name}</td>
                    <td>{item.Scheduled_Date}</td>
                    <td>
                     <div>
                    <button onClick={()=>{
                setshowTestDialog(true);
                setPatient(item.Name);
                setPid(item.Patient_id);
                settype1("Test");
                get1("tests");
            }}>
                    Prescribe Test
                    </button>
                    </div>
                    </td>
                    <td> <div><button onClick={()=>{ 
                setshowTestDialog(true);
                setPatient(item.Name);
                setPid(item.Patient_id);
                settype1("Treatment");
                get1("treatments");     
            }}>
                    Prescribe Treatment
                    </button></div></td>
                    <td><div><button onClick={()=>{
                setshowTestDialog(true);
                setPatient(item.Name);
                setPid(item.Patient_id);
                setaid(item.Appointment_id);
                settype1("remarks")
            }}>Add Prescription</button></div></td>
                  </tr>
                );
              })}
          </table>)
        }
          {!(FAppointments.length) && (
           <div style={{fontSize:18,color:"black"}}>No Upcoming appointments at the moment :)<br/><br/><br/><br/></div>
        )}
      </div>


      { type === "All" && 
      <div className="Table">
        <br/><br/>
          <h2>Past Appointments</h2>
        {
         PAppointments.length>0 && (
          <div>
         
          <table className="table">
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>Appointment ID</th>
                <th style={{ textAlign: "center" }}>Patient ID</th>
                <th style={{ textAlign: "center" }}>Patient Name</th>
                <th style={{ textAlign: "center" }}>Scheduled Time(YYYY-MM-DD)</th>
                <th style={{ textAlign: "center" }}>Add Prescription</th>
                <th style={{ textAlign: "center" }}>Prescribe Test</th>
                <th style={{ textAlign: "center" }}>Prescribe Treatment</th>
              </tr>
            </thead>
              {PAppointments.map((item, index) => {
                return (
                  <tr key={index}>
                    <th>{item.Appointment_id}</th>
                    <td>{item.Patient_id}</td>
                    <td>{item.Name}</td>
                    <td>{item.Scheduled_Date}</td>
                    <td><div><button onClick={()=>{
                setshowTestDialog(true);
               // setinfo({Name: item.Name,Patient_id: item.Patient_id,Aid: item.Appointment_id})
                setPatient(item.Name);
                setPid(item.Patient_id);
                setaid(item.Appointment_id);
                settype1("remarks")
            }}>Add Prescription</button></div></td>
                    <td>
                    <div> <button onClick={()=>{
                setshowTestDialog(true);
                //setinfo({Name: item.Name,Patient_id: item.Patient_id,Aid: item.Appointment_id})
                setPatient(item.Name);
                setPid(item.Patient_id);
                settype1("Test")
                get1("tests")
            }}>
                    Prescribe Test
                    </button></div>
                    
           
                    </td>
                    <td> <div> <button onClick={()=>{
                setshowTestDialog(true);
                //setinfo({Name: item.Name,Patient_id: item.Patient_id,Aid: item.Appointment_id})
                setPatient(item.Name);
                setPid(item.Patient_id);
                settype1("Treatment")
                get1("treatments")
            }}>
                    Prescribe Treatment
                    </button></div></td>
                  </tr>
                );
              })}
          </table>
          </div>)
          
        }
          {!(PAppointments.length) && (
           <div style={{fontSize:18,color:"black"}}>No past appointments till now :)<br/><br/><br/><br/></div>
        )}
      </div>
}
      <br></br>
      </div>
    
    
  )
}

export default ShowAppointments;
