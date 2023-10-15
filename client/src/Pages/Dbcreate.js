import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "./style/Dbcreate.css";

const validationSchema = Yup.object({
  Username: Yup.string()
    .required("Username is required"),
  Type: Yup.string().required("User Type is required"),
  Email: Yup.string().email("Invalid email").required("Email is required"),
  Password: Yup.string().required("Password is required"),
});
let Name,email,password;
function Dbcreate() {
  const [spec,setspec] =useState("")
  const [ID,setid] =useState("")
  const [Name,setname] =useState("")
  const [valid,setvalid]=useState(true)
  // const [type,settype]=useState("")
  // const [email,setemail]=useState("")
  // const [password,setpassword]=useState("")
  const navigate = useNavigate();
  const { userID } = useParams();
  useEffect(() => {
    axios.get(`http://localhost:3001/Dbadmin/get/${userID}`).then((resp) => {
      formik.setValues({ ...resp.data[0] });
    });
  }, [userID]);
  const [showmodal,setshowmodal] =useState(false);
  const formik = useFormik({
    initialValues: {
      Username: "",
      Type: "",
      Email: "",
      Password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (!userID) {
        axios
          .post("http://localhost:3001/Dbadmin", values)
          .then((resp) => {
            console.log(resp.data.insertId);
            setid(resp.data.insertId);
            setname(values.Username)
            formik.resetForm();
            if (values.Type === "Doctor") {
              setshowmodal(true);
            } else {
              toast.success("User added succesfully User ID:"+resp.data.insertId);
              setTimeout(() => {
                navigate("../Dbadmin");
              }, 500);
            }
          })
          .catch((err) => toast.error(err.response.data));
     }
     else {
        axios
          .put(`http://localhost:3001/Dbadmin/put/${userID}`, values)
          .then((resp) => {
            console.log(resp.data.insertId);
            setid(resp.data.insertId);
            setname(values.Username)
            formik.resetForm();
            // if (values.Type === "Doctor") {
            //   //setshowmodal(true);
            //   //navigate(`../Dbdoctor/${resp.data.insertId}/${values.Username}`);
            // } 
            //else {
              toast.success("User updated succesfully");
              setTimeout(() => {
                navigate("../Dbadmin");
              }, 500);
            //}
          })
          .catch((err) => toast.error(err.response.data));
      }
    },
  });
 
  const insertdoc =()=>{
    if(!spec)
    {
      setvalid(false)
      return;
    }
    if(!userID){
      axios.post("http://localhost:3001/Dbadmin/doctor", {
            Name,
            ID,
            spec,
          })
          .then((response) => {
            if(response.status===200) 
            {
              setshowmodal(false)
              toast.success("User added succesfully User ID:"+ID);
              setTimeout(() => {
                navigate("../Dbadmin");
              }, 500);
            }
          })
    }
    else{
      axios.put(`http://localhost:3001/Dbadmin/put/doctor/${userID}`, {
            Name,
            ID,
            spec,
          })
          .then((response) => {
            if(response.status===200) 
            {
              setshowmodal(false)
              toast.success("User updated succesfully User ID:"+ID);
              setTimeout(() => {
                navigate("../Dbadmin");
              }, 500);
            }
          })

    }
  }
  // const handleModalClose=()=>{
  //   setshowmodal(false);
  // }
  const { values, touched, errors, handleChange, handleBlur, handleSubmit } =
    formik;
  return (
    <div>
      {showmodal && (
       <div className="modal">
       <div className="modal-content">
        <div className="outer-box2">
         {/* <span className="close" onClick={handleModalClose}>
           &times;
         </span>  */}
         <h1 style={{fontSize:20,color:"black"}}> Enter Specialization for the doctor</h1>
          <br></br>
           <label>
            {!valid&&(<div style={{color:"red"}}>Please enter the specialization</div>)}
             Specialization:   <br /> 
             <input type="text" placeholder="Specialization" onChange={(event) => setspec(event.target.value)}/>
              <br /> 
           </label>
         <button onClick={insertdoc}>Submit</button>
         </div>
       </div>
     </div>
      )

      }
      <div class="outer-box">
        <h2>User Registration</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="Username">Username</label>
        <input
          type="text"
          id="Username"
          name="Username"
          placeholder="Username"
          value={values.Username}
          onChange={handleChange}
          onBlur={handleBlur}
          className={touched.Username && errors.Username ? "error" : null}
        />
        {touched.Username && errors.Username ? (
          <div className="errorMsg">{errors.Username}</div>
        ) : null}

        <label htmlFor="Type">User Type</label>
        <select
          name="Type"
          id="Type"
          value={values.Type}
          onChange={handleChange}
          onBlur={handleBlur}
          className={touched.Type && errors.Type ? "error" : null}
        >
          <option value="">Select a user type</option>
          <option value="Front-Desk Operator">Front Desk Operator</option>
          <option value="Data-Entry Operator">Data Entry Operator</option>
          <option value="Doctor">Doctor</option>
          <option value="Database Administrator">Database Administrator</option>
        </select>
        {touched.Type && errors.Type ? (
          <div className="errorMsg">{errors.Type}</div>
        ) : null}
        {/* <label htmlFor="Specialization">Specialization</label> */}
        {/* <input
          type="text"
          id="Specialization"
          name="Specalization"
          placeholder="Specialization"
          value={values.Specialization}
          onChange={handleChange}
          onBlur={handleBlur}
          className={touched.Specialization && errors.Specialization ? "error" : null}
        />
        {touched.Specialization && errors.Specialization ? (
          <div className="errorMsg">{errors.Specialization}</div>
        ) : null} */}
        <label htmlFor="Email">Email</label>
        <input
          type="email"
          id="Email"
          name="Email"
          placeholder="Email"
          value={values.Email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={touched.Email && errors.Email ? "error" : null}
        />
        {touched.Email && errors.Email ? (
          <div className="errorMsg" style={{color:"red"}}>{errors.Email}</div>
        ) : null}
       
        <label htmlFor="Password">Password</label>
        <input
          type="password"
          id="Password"
          name="Password"
          placeholder="Password"
          value={values.Password}
          onChange={handleChange}
          onBlur={handleBlur}
          className={touched.Password && errors.Password ? "error" : null}
          readOnly={!!values.UserID}
        />
        {touched.Password && errors.Password ? (
          <div className="errorMsg">{errors.Password}</div>
        ) : null}

        <input class="save-button" type="submit" value={userID ? "Update" : "Save"} />
        {/* <button onClick={()=>{if(values.Type==="Doctor") setshowmodal(true)}}>{userID ? "Update" : "Save"}</button>  */}

        <Link to="../Dbadmin">
          <input class="save-button" type="button" value={"Go back"} />
          {/* <button>Go Back</button> */}
        </Link>
      </form>
      <ToastContainer />
    </div>
    </div>
  );
}

export default Dbcreate;
