import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify';
import ShowFiles from './ShowFiles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faBars} from '@fortawesome/free-solid-svg-icons'
function PatientsDashboard() {
  const { Doctor_id } = useParams()
  const [Patients, setPatients] = useState([])
  const [results, setresults] = useState([])
  const [type, settype] = useState("")
  const [name, setname] = useState("")
  const [showfiles, setshowfiles] = useState(false)
  const [id,setid]=useState("")
  const loadPatients = () => {
    axios.get(`http://localhost:3001/Doctor/patient_history/${Doctor_id}`).then(response => {
      setPatients(response.data)
      console.log(response)
    });
  }
  useEffect(() => {
    loadPatients();
  }, []);
  const [file_list, setfilelist] = useState([]);
  const getfiles = (type,id) => {
    axios.get(`http://localhost:3001/Dentry/files/${type}/${id}`).then(response => {
      console.log(response.data)
      setfilelist(response.data)
    })
  }
  const getresults = (id, type1) => {

    axios.get(`http://localhost:3001/Doctor/${id}/${type1}/results`).then(response => {
      setresults(response.data)
      console.log(response.data)
    });
    // axios.get(`http://localhost:3001/Dentry/files/${type1}/${id2}`).then(response => {
    //   console.log(typeof response.data)
    //   setfilelist(response.data)
    // })
    return;
  }
  const [showTestDailog, setshowTestDialog] = useState(false)
  const handleDailogClose = () => {
    setshowTestDialog(false);
  }
  const handlefilesClose = () => {
    setshowfiles(false)
    setfilelist([])
  }
  const handleShowfiles =(ptuid)=>{
    if(type ==="est")setid(ptuid);
    if(type ==="reatment")setid(ptuid); 
    getfiles(`T${type}`,ptuid); 
    setshowfiles(true); 
    return;

  }
  //const [filename,setfilename]=useState("")
  
  return (
     <div>
    <div className='outer-box1'>
      {showTestDailog && (
        <div className="modal">
          <div className="modal-content" style={{ width: 1300 }}>
            <div className='outer-box1'>
            <span className="close" onClick={handleDailogClose}>
              &times;
            </span>
            {(results.length > 0) && (type === "est" || type === "reatment") && (<label>

              <h1 style={{ textAlign: "center", fontSize: 20 }}>List of all the t{type}s prescribed to Mr/Mrs.{name} <br /><br /></h1>
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>T{type} ID</th>
                    <th style={{ textAlign: "center" }}>T{type} Name</th>
                    <th style={{ textAlign: "center" }}>Prescribed by</th>
                    <th style={{ textAlign: "center" }}>Scheduled Date(YYYY-MM-DD)</th>
                    <th style={{ textAlign: "center", width: 200 }}>Result</th>
                    {(<th style={{ textAlign: "center" }}>Files(Click to Download)</th>)}
                  </tr>
                </thead>
                {results.map((item, index) => {
                  return (
                    <tr key={index}>
                      {type === "est" && (<th style={{ textAlign: "center" }}>{item.PT_id}</th>)}
                      {type === "reatment" && (<th style={{ textAlign: "center" }}>{item.U_id}</th>)}
                      <td style={{ textAlign: "center" }}>{item.T_Name}</td>
                      <td style={{ textAlign: "center" }}>{item.D_Name}</td>
                      {item.Scheduled_Date === "1970-01-01 05:30:00" && (<td style={{ textAlign: "center" }}>Not Yet Scheduled</td>)}
                      {!(item.Scheduled_Date === "1970-01-01 05:30:00") && (<td style={{ textAlign: "center" }}>{item.Scheduled_Date}</td>)}
                      {item.Result && (<td style={{ textAlign: "center" }}>{item.Result}</td>)}
                      {!item.Result && (<td style={{ textAlign: "center" }}>Not Yet Evaluated</td>)}
                      { <td><div><button onClick={()=>{if(type==="est")handleShowfiles(item.PT_id);if(type==="reatment")handleShowfiles(item.U_id)}}>
                        Show Files
                      </button></div></td>}
                    </tr>);
                })}
              </table>
            </label>)}
            {showfiles && (
              <div className="modal">
                <div className="modal-content" style={{ width: 500 }}>
                  <span className="close" onClick={handlefilesClose}>
                    &times;
                  </span>
                  <h1 style={{fontSize:20,color:"black"}}>Files related to the t{type}<br/><br/></h1>
                  {type=="est" && showfiles &&  (    
                          <td>
                            {file_list.map(value => {
                              return (
                              <div key={value}>
        
                                <a href={"http://localhost:3001/Dentry/download/test/"+id+"/"+value}>{value}</a>
              
                              </div>)
                            })}
                          </td>
                         
                      )}
                      {type=="reatment" && showfiles && (    
                          <td>
                            {file_list.map(value => {
                              return (
                              <div key={value}>
                                <a href={"http://localhost:3001/Dentry/download/treatment/"+id+"/"+value}>{value}</a>
                              </div>)
                            })}
                          </td>
                         
                      )}
                      {file_list.length===0&&(<div style={{fontSize:18,color:"black"}}>No files uploaded yet</div>)}
                    
                </div>
              </div>
            )}
            {(results.length === 0) && (type === "est" || type === "reatment") && (<div>No T{type}s are prescribed to the patient</div>)}
            {(results.length > 0) && (type === "description") && (<label>

              <h1 style={{ textAlign: "center", fontSize: 20 }}>Remarks on Mr/Mrs.{name} from all doctors <br /><br /></h1>
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>Appointment ID</th>
                    <th style={{ textAlign: "center" }}>Evaluated by</th>
                    <th style={{ textAlign: "center" }}>Date of Appointment(YYYY-MM-DD)</th>
                    <th style={{ textAlign: "center", width: 400 }}>Remarks</th>
                  </tr>
                </thead>
                {results.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td style={{ textAlign: "center" }}>{item.Appointment_id}</td>
                      <td style={{ textAlign: "center" }}>{item.D_Name}</td>
                      {item.Scheduled_Date === "1970-01-01 5:30:00" && (<td style={{ textAlign: "center" }}>Not Yet Scheduled</td>)}
                      {!(item.Scheduled_Date === "1970-01-01 5:30:00") && (<td style={{ textAlign: "center" }}>{item.Scheduled_Date}</td>)}
                      <td style={{ textAlign: "center" }}>{item.Description}</td>
                    </tr>
                  );
                })}
              </table>
            </label>)}
            {(results.length === 0) && (type === "description") && (<div>No remarks are given to the patient</div>)}

            <br />
            </div>
          </div>
        </div>
      )}



      <div className="Table">
        <br />
        <h2>Your Patients</h2>
        <br />
        {
          Patients.length > 0 && (
            <table className="table">
              <thead>
                <tr>
                  <th style={{ textAlign: "center" }}>Patient ID</th>
                  <th style={{ textAlign: "center" }}>Patient Name</th>
                  <th style={{ textAlign: "center" }}>Phone</th>
                  <th style={{ textAlign: "center" }}>Click for Description</th>
                  <th style={{ textAlign: "center" }}>Click for Test results</th>
                  <th style={{ textAlign: "center" }}>Click for Treatment results</th>
                </tr>
              </thead>
              {Patients.map((item, index) => {
                return (
                  <tr key={index}>
                    <th>{item.Patient_id}</th>
                    <td>{item.Name}</td>
                    <td>{item.Phone}</td>
                    <td>
                      <div><button onClick={() => { setname(item.Name); settype("description"); setshowTestDialog(true); getresults(item.Patient_id, "Description") }}>
                        Description
                      </button></div>
                    </td>
                    <td> <div><button onClick={() => { setname(item.Name); settype("est"); setshowTestDialog(true); getresults(item.Patient_id, "Test") }}>
                      Test Results
                    </button></div></td>
                    <td> <div><button onClick={() => { setname(item.Name); settype("reatment"); setshowTestDialog(true); getresults(item.Patient_id, "Treatment") }}>
                      Treatment Results
                    </button></div></td>
                  </tr>
                );
              })}
            </table>)
        }
      </div>
    </div>
    </div>
  )

}
export default PatientsDashboard;