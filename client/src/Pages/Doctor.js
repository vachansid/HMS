import React, { useEffect , useState} from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {toast} from "react-toastify";
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faFaceGrinBeam as faFaceSmileBeam,faUser,faBell} from '@fortawesome/free-regular-svg-icons'
import {faBars, faCaretDown,faCaretUp} from '@fortawesome/free-solid-svg-icons'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar'
//import { solid, regular, brands, icon } from '@fortawesome/fontawesome-svg-core/import.macro'
function Doctor() {

  const {Doctor_id} = useParams()
  console.log(Doctor_id)
  const [Docinfo,setDocinfo]=useState([])
  const [Patients,setPatients]=useState([])
  const [count,setcount]=useState({})
  const [FAppointments,setFAppointments]=useState([])
  const [showtable,setshowtable] =useState(false)
  const navigate=useNavigate()
  useEffect(()=>{
    axios.get(`http://localhost:3001/Doctor/byid/${Doctor_id}`).then(response=>{
       console.log(response)
       setDocinfo(response.data)
    });
  },[]);
  const show=()=>{
     axios.get(`http://localhost:3001/Doctor/byid_getpatients/${Doctor_id}`).then((response)=>{
         setPatients(response.data)
         console.log(response.data)
     })
  }
  
  useEffect(()=>{ 
    
    axios.get(`http://localhost:3001/Doctor/byid_getcount/${Doctor_id}`).then(response=>{
        setcount(response.data)
        console.log(response.data)
    })
    axios.get(`http://localhost:3001/Doctor/byid/${Doctor_id}/Appointments/Future`).then((response)=>{
      setFAppointments(response.data)
      console.log(response.data)
  });

 },[]);
 
  let Doc={};
  if(Docinfo.length>0) Doc=Docinfo[0];
  let c={}
  if(count.length>0) c=count[0];
  const [show1,setshow]=useState(false)
  const handleClose=()=>{
    setshow(false)
  }

  return (
  <div>
    <div style={{position:"absolute",top:8,left:8}}><button style={{transform:"scale(1.4)",padding:8,marginLeft:0,marginTop:0,borderRadius:3}} onClick={()=>{setshow(true)}}><FontAwesomeIcon style= {{fontSize:30}}icon={faBars} /></button> </div>
  <div className="outer-box1">
    
    <Offcanvas show={show1} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title><h2 style={{fontSize: 25}}></h2></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
       
        <h2 style={{color: "#074f73"}}>
          
        <FontAwesomeIcon icon={faUser} />  {Doc.Username} <br/>
       <h1 style={{fontSize:20}}> User ID : {Doc.UserID} </h1>
        </h2>
    <br />
    <br/>
    <button onClick={() => navigate('./Appointments/Future')}>Future Appointments <Badge bg="black" color="rgb(56, 245, 56)">{c.count_patient}</Badge></button>
    <br/>
    <br/>
    <button onClick={() => navigate('./Appointments/All')}>All Appointments</button>
    <br/>
    <br/>
    <button onClick={() => navigate('./Patients')}>Patients Dashboard</button>
        </Offcanvas.Body>
      </Offcanvas>
   
    <h1>Hello Dr. {Doc.Username}!!<FontAwesomeIcon icon={faFaceSmileBeam} /></h1>
    <br />
    <br/>
    {/* <button onClick={()=>{
      setshow(true);
    }}>Dashboard</button> */}
    <br/>
    <h2 style={{fontSize:20}}>You have {c.count_patient} upcoming appointments. For more details, please check the dashboard</h2>
    <br/>
    <br/>
    <br/>
    {!showtable && (<h2 style={{position:"absolute",left:250,fontSize:25}}><FontAwesomeIcon icon={faBell} /> Upcoming Appointments  <Badge bg="black" style={{fontSize:10}}>{c.count_patient}</Badge><button style={{padding:2,marginLeft:8}} onClick={()=>{setshowtable(true)}}><FontAwesomeIcon style= {{fontSize:30}}icon={faCaretDown} /></button> </h2>)}
    {showtable && (<h2 style={{position:"absolute",left:250,fontSize:25}}><FontAwesomeIcon icon={faBell} /> Upcoming Appointments  <Badge bg="black" style={{fontSize:10}}>{c.count_patient}</Badge><button style={{padding:2,marginLeft:8}} onClick={()=>{setshowtable(false)}}><FontAwesomeIcon style= {{fontSize:30}}icon={faCaretUp} /></button> </h2>)}
    <br/>
    <br/>
    <div className="outer-box1">
         {/* <h2>Future Appointments</h2> */}
        {
         FAppointments.length>0 && showtable && (
          <table className="table">
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>Appointment ID</th>
                <th style={{ textAlign: "center" }}>Patient ID</th>
                <th style={{ textAlign: "center" }}>Patient Name</th>
                <th style={{ textAlign: "center" }}>Gender</th>
                <th style={{ textAlign: "center" }}>Phone</th>
                <th style={{ textAlign: "center" }}>Scheduled Time(YYYY-MM-DD)</th>
                
                {/* <th style={{ textAlign: "center" }}>Prescribe Test</th>
                <th style={{ textAlign: "center" }}>Prescribe Treatment</th>
                <th style={{ textAlign: "center" }}>Add Remarks</th> */}
              </tr>
            </thead>
              {FAppointments.map((item, index) => {
                return (
                  <tr key={index}>
                    <th>{item.Appointment_id}</th>
                    <td>{item.Patient_id}</td>
                    <td>{item.Name}</td>
                    <td>{item.Gender}</td>
                    <td>{item.Phone}</td>
                    <td>{item.Scheduled_Date}</td>
                    {/* <td>
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
            }}>Add Remarks</button></div></td> */}
                  </tr>
                );
              })}
          </table>)
        }
          {!(FAppointments.length) && (
           <div style={{fontSize:18,color:"black"}}>No Upcoming appointments at the moment :)<br/><br/><br/><br/></div>
        )}
      </div>

    {/* <h2 style={{fontSize:30, marginRight:800}} >Notifications <FontAwesomeIcon icon={faBell}/> <Badge bg="black" color="rgb(56, 245, 56)">{c.count_patient}</Badge></h2> */}
  </div>
  
  </div>
    
  )
}

export default Doctor;
