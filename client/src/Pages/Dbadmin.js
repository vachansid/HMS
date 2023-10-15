import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import DBADMIN from './style/Dbadmin.scss'

function Dbadmin() {
  const [data, setData] = useState([]);
  const loadData = async () => {
    const response = await axios.get("http://localhost:3001/Dbadmin");
    console.log(response.data);
    setData(response.data);
  };

  useEffect(() => {
    loadData();
  }, []);
  const [showtable, setshowtable] = useState(false);
  const deleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      axios.delete(`http://localhost:3001/Dbadmin/delete/${id}`).then(resp=>{
        if(resp.status===200){
        toast.success("User deleted");
        setTimeout(() => loadData(), 500)
        }
      })
     
    }
  };
  return (

    <div>
      <div className="outer-box1">
        <h1>Database Administrator Page</h1>
        <br/>
        <Link to="/Dbcreate">
            <button>Create User</button>
          </Link>
          {!showtable && (<button onClick={() => { setshowtable(true) }}>Show users</button>)}
          {showtable && (<button onClick={() => { setshowtable(false) }}>Hide All</button>)}
          <br/>
          <br/>
        <div className="Dbadmin">
          {showtable && (
            <table class="table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Email</th>
                  <th>Click to </th>
                </tr>
              </thead>

              {data.map((value, key) => {
                return (
                  <tr>
                    <th>{value.UserID}</th>
                    <td>{value.Username}</td>
                    <td>{value.Type}</td>
                    <td>{value.Email}</td>
                    <td>
                      <div>
                      <button style={{backgroundColor:"rgb(177, 71, 47)"}}onClick={() => deleteUser(value.UserID)}>Delete</button>
                      <Link to={`/Dbupdate/${value.UserID}`}>
                        <button>Edit</button>
                      </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </table>)
          }
         

        </div>
      </div>
    </div>
  );
}

export default Dbadmin;







// {showtable && (
//   <table className="table">
//     <thead>
//       <tr>
//         <th style={{ textAlign: "center" }}>UserID</th>
//         <th style={{ textAlign: "center" }}>Username</th>
//         <th style={{ textAlign: "center" }}>Type</th>
//         <th style={{ textAlign: "center" }}>Email</th>
//         <th style={{ textAlign: "center" }}>Password</th>
//         <th style={{ textAlign: "center" }}>Click to Edit/Delete</th>
//       </tr>
//     </thead>
//     <tbody>
//       {data.map((item, index) => {
//         return (
//           <tr key={item.UserID}>
//             <th style={{ textAlign: "center" }}>{item.UserID}</th>
//             <td style={{ textAlign: "center" }}>{item.Username}</td>
//             <td style={{ textAlign: "center" }}>{item.Type}</td>
//             <td style={{ textAlign: "center" }}>{item.Email}</td>
//             <td style={{ textAlign: "center" }}>{item.Password}</td>
//             <td>
//               <button
//                 className="btn btn-delete"
//                 onClick={() => deleteUser(item.UserID)}
//               >
//                 Delete
//               </button>
//               <Link to={`/Dbupdate/${item.UserID}`}>
//                 <button className="btn btn-edit">Edit</button>
//               </Link>
//             </td>
//           </tr>
//         );
//       })}
//     </tbody>
//   </table>)
// }