import React, { useEffect , useState} from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import {  toast } from 'react-toastify';
import moment from 'moment';
function RoomAllotment() {

    const[PatientsList,setPatientsList] =useState([]);
    const loadPatients=()=>{

      axios.get("http://localhost:3001/Frontdesk/admitants").then(response=>{
            setPatientsList(response.data);
            
      })
    }    
    useEffect(()=>{
       loadPatients();
    },[]);

    return(

      <div className='outer-box1'>
         <h2>All Patients</h2>
        {
          <table className="table">
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>Patient ID</th>
                <th style={{ textAlign: "center" }}>Name</th>
                <th style={{ textAlign: "center" }}>Phone</th>
                <th style={{ textAlign: "center" }}>Email</th>
                <th style={{ textAlign: "center" }}>Registration Date(YYYY-MM-DD)</th>
                <th style={{ textAlign: "center" }}>Click to Admit</th>
              </tr>
            </thead>
              {PatientsList.sort((a,b)=>moment(b.Registration_Date)-moment(a.Registration_Date)) &&
              PatientsList.map((item, index) => {
                return (
                  <tr key={index}>
                    <th>{item.Patient_id}</th>
                    <td>{item.Name}</td>
                    <td>{item.Phone}</td>
                    <td>{item.Mail}</td>
                    <td>{item.Registration_Date}</td> 
                    <td>
                      <div>
                      <button onClick={()=>{
                        axios.get(`http://localhost:3001/Frontdesk/${item.Patient_id}/${item.Admit_Status}`).then(response=>{
                              if(response.status===200)
                              {
                                console.log(response.data)
                                let f=[];
                                f=response.data;
                                console.log(f);
                                let f1={};
                                f1=f[0];
                                if(item.Admit_Status==="Admit"){
                                if(f1.Room_no!="-1"){
                                toast.success("Room Alloted successfully\nAlloted Room Number: "+f1.Room_no+"\nTotal Cap: "+f1.Max_capacity+"\n    Rem Cap: "+(f1.Rem_capacity-1)+"\n   Type: "+f1.Type,{setTimeout:10})
                                
                                }
                                else
                                {
                                  toast.error("Uh-oh!\nRooms are not available at the moment")
                                }
                               }
                               else if(item.Admit_Status==="Discharge")
                               {
                                toast.success("Discharged successfully\nDischarged Room No: "+f1.Room_no+"\nTotal Cap: "+f1.Max_capacity+"\nRem Cap: "+(f1.Rem_capacity+1)+"\nType: "+f1.Type,{setTimeout:10})
                               }
                              }
                              else toast.error("Server Error")
                              setTimeout(()=>loadPatients(), 500)
                        })
                      }}>{item.Admit_Status}</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </table>
        }
      </div>

    )

}

export default RoomAllotment;