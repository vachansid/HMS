import React from 'react'
import axios from 'axios'
import  {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import 'bootstrap/dist/css/bootstrap.css';

import './style/Login.css'
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  // const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if(!username|| !password){
      //alert("A field is empty")
      toast.error("Please provide a value for username/password")
    }
    else{

      try {
        const res = await axios.post("http://localhost:3001/Login", {
          username,
          password,
          userType,
        });
        console.log(res)
        if(res.status===200){
          if (userType === 'Front-Desk Operator') {
            navigate('../Frontdesk')   
         } else if (userType === 'Data-Entry Operator') {
           navigate('../Dentry')
         } else if (userType === 'Doctor') {
           navigate(`../Doctor/${username}`)
         } else if (userType === 'Database Administrator') {
           navigate('../Dbadmin')
         }
        }
        else{
         console.log("i")
          // alert(res.message);
        }
        
      } catch (error) {

        alert("incorrect username/password")
        toast.error(error.response.data)
        console.error(error);
        // setErrorMessage(error.response.data);
      }
    }
  };
  //id/60/
  return (
<div class="outer-box">
  <div class="doodles">
    <img src="https://picsum.photos/100" alt="doodle1" /> 
  </div>
  <h2>LOGIN</h2>
  <form onSubmit={handleSubmit}>
    <label>
      User ID:<br/>
      <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} />
    </label>
    <label>
      Password: <br/>
      <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
    </label>
    <label>
      User type:
      <select value={userType} onChange={(event) => setUserType(event.target.value)}>
        <option>---Select a Type---</option>
        <option value="Front-Desk Operator">Front Desk Operator</option>
        <option value="Data-Entry Operator">Data Entry Operator</option>
        <option value="Doctor">Doctor</option>
        <option value="Database Administrator">Database Administrator</option>
      </select>
    </label>
    <button class="primary-btn" type="submit">Login</button>
  </form>
</div>

  );
};

export default Login;
