import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
// import {toast} from "react-toastify";
import axios from "axios";


function DPinfo() {
  const [state, setState] = useState([]);

  const [state2, setState2] = useState([]);

  const navigate = useNavigate();

  const { patientID } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:3001/Dentry/get/tests/${patientID}`)
      .then((resp) => {
        // console.log(resp.data[0]);
        setState(resp.data);
      });
  }, [patientID]);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/Dentry/get/treatments/${patientID}`)
      .then((resp) => {
        setState2(resp.data);
      });
  }, [patientID]);

  console.log(state2);
  const [showTestDialog,setshowTestDialog] =useState(false);
  return (
    <div class="outer-box2">
      <h2 style={{fontSize: 50}}>Patient Info</h2>
      <br/>
        <h2>Tests</h2>  
      {
         state.length>0 && (
          <table className="table">
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>Patient</th>
                <th style={{ textAlign: "center" }}>Doctor</th>
                <th style={{ textAlign: "center" }}>Test</th>
                <th style={{ textAlign: "center" }}>Scheduled Date(YYYY-MM-DD)</th>
                <th style={{ textAlign: "center",width:300}}>Result</th>
                <th style={{ textAlign: "center" }}>Click to Add/Edit</th>
              </tr>
            </thead>
              {state.map((item, index) => {
                return (
                  <tr key={index}>
                    <th>{item.Patient}</th>
                    <td>{item.Doctor}</td>
                    <td>{item.Test}</td>
                    {item.Date === "1970-01-01 05:30:00" && (<td style={{ textAlign: "center" }}>Not Yet Scheduled</td>)}
                    {!(item.Date === "1970-01-01 05:30:00") && (<td style={{ textAlign: "center" }}>{item.Date}</td>)}
                    {item.Result && (<td>{item.Result}</td>)}
                    {!item.Result && (<td>Not Yet Evaluated</td>)}
                    <td>
                      <div>
                    <button onClick={()=>{navigate(`/DPupdateTest/${item.PT_id}`);}}>Add/Edit Result</button>
                    </div>
                    </td>
                  </tr>
                );
              })}
          </table>)
        }
         {
          state.length===0 && (<div>Tests are not prescribed yet :)</div>)
        }
      <div className="Table">
      <br/>
        <h2>Treatments</h2>
        {
         state2.length>0 && (
          <table className="table">
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>Patient</th>
                <th style={{ textAlign: "center" }}>Doctor</th>
                <th style={{ textAlign: "center" }}>Treatment</th>
                <th style={{ textAlign: "center" }}>Scheduled Time(YYYY-MM-DD)</th>
                <th style={{ textAlign: "center",width:300}}>Result</th>
                <th style={{ textAlign: "center" }}>Click to Add/Edit</th>
              </tr>
            </thead>
              {state2.map((item, index) => {
                return (
                  <tr key={index}>
                    <th>{item.Patient}</th>
                    <td>{item.Doctor}</td>
                    <td>{item.Treatment}</td>
                    {item.Date === "1970-01-01 05:30:00" && (<td style={{ textAlign: "center" }}>Not Yet Scheduled</td>)}
                    {!(item.Date === "1970-01-01 05:30:00") && (<td style={{ textAlign: "center" }}>{item.Date}</td>)}
                    {item.Result && (<td>{item.Result}</td>)}
                    {!item.Result && (<td>Not Yet Evaluated</td>)}
                    <td>
                      <div>
                    <button onClick={()=>{navigate(`/DPupdateTreatment/${item.U_id}`);}}>Add/Edit Result</button>
                    </div>
                    </td>
                  </tr>
                );
              })}
          </table>)
        }
         {
          state2.length===0 && (<div>Treatments are not prescribed yet :)</div>)
        }
      </div>
    </div>
  );
}

export default DPinfo;
