import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function Dentry() {
  console.log("jkk")
  const [data1, setData1] = useState([]);
  const loadDataa = async () => {
    const response = await axios.get("http://localhost:3001/Dentry");
    console.log(response.data);
    setData1(response.data);
  };
  useEffect(() => {
    loadDataa();
  }, []);
  const navigate = useNavigate()
  return (
    <div class="outer-box2">
      <div className="Dentry">
        <h2 style={{fontSize: 50}}>Patients Dashboard</h2>
        {
          (<table className="table">
            <thead>
              <tr>
                <th>Patient_id</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Click to view</th>
                </tr>
            </thead>
              {data1.map((value, key) => {
                return (
                  <tr>
                    <th>{value.Patient_id}</th>
                    <td>{value.Name}</td>
                    <td>{value.Gender}</td>
                    <td>{value.Phone}</td>
                    <td>{value.Mail}</td>
                    <td>
                      <div>
                      <button onClick={() => { navigate(`/DPinfo/${value.Patient_id}`) }}>View Test/Treatments</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </table>)
      }
      </div>
    </div>
  );
}

export default Dentry;
