import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

function DPupdateTreatment() {
  const [state, setState] = useState([]);

  const navigate = useNavigate();

  const { U_id } = useParams();

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:3001/Dentry/get/treatment/${U_id}`)
      .then((resp) => {
        setState({ ...resp.data[0] });
      });
  }, [U_id]);
  const { Patient,Patient_id, Doctor, Treatment, Result } = state;
  const saveFile = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };
  const uploadFile = async (e) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);
    try {
      const res = await axios.post(`http://localhost:3001/Dentry/uploadtreatment/${U_id}`, formData);
      console.log(res);
      toast.success("File uploaded successfully.");
    } catch (ex) {
      toast.error("Failed to upload file.");
      console.log(ex);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!Patient || !Doctor || !Treatment) {
      toast.error("Please fill all the fields.");
    }
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("Result", Result);

      const res = await axios.post(
        `http://localhost:3001/Dentry/post/treatment/${U_id}`,
        { Result }
      );
      console.log(res.data);
      toast.success("Result updated.");
      navigate(backpath);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update result.");
    }
  };



const backpath="/DPinfo/"+Patient_id
  const haandleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  return (
    <div class="outer-box">
      <h2>Updating Treatment result</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="Patient">Patient</label>
        <input
          type="text"
          id="name"
          name="Patient"
          placeholder="Patient"
          value={Patient || ""}
          readOnly
        ></input>

        <label htmlFor="Doctor">Doctor</label>
        <input
          type="name"
          id="Doctor"
          name="Doctor"
          placeholder="Doctor"
          value={Doctor || ""}
          readOnly
        ></input>

        <label htmlFor="Treatment">Treatment</label>
        <input
          type="text"
          id="Treatment"
          name="Treatment"
          placeholder="Treatment"
          value={Treatment || ""}
          readOnly
        ></input>

        <label htmlFor="Result">Result</label>
        <textarea 
          rows="4" cols="50"
          type="text"
          id="Result"
          name="Result"
          placeholder=""
          value={Result || ""}
          onChange={haandleInputChange}
        />
        
       
        <input class="save-button" type="submit" value="Save" />
        {/* <button class="save-button" onClick={uploadFile}>Go back</button> */}
        
      </form>
      <input type="file" onChange={saveFile} />
       < button class="save-button" onClick={uploadFile}>Upload file</button>
      <Link to={backpath}>
          <input class="save-button" type="button" value="Go Back">
          </input>
        </Link>
    </div>
  );
}

export default DPupdateTreatment;
