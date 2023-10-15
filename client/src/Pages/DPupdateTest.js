import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

function DPupdateTest() {
  const [state, setState] = useState([]);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const navigate = useNavigate();
  const { PT_id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:3001/Dentry/get/test/${PT_id}`)
      .then((resp) => {
        setState({ ...resp.data[0] });
      });
  }, [PT_id]);

  const { pt_id,Patient,Patient_id, Doctor, Test, Result } = state;
  const saveFile = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const uploadFile = async (e) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);
    try {
      const res = await axios.post(`http://localhost:3001/Dentry/uploadtest/${PT_id}`, formData);
      console.log(res);
      toast.success("File uploaded successfully.");
    } catch (ex) {
      toast.error("Failed to upload file.");
      console.log(ex);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!Patient || !Doctor || !Test || !Result) {
      toast.error("Please fill all the fields.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("Result", Result);

      const res = await axios.post(
        `http://localhost:3001/Dentry/post/test/${PT_id}`,
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };
  const backpath="/DPinfo/"+Patient_id

  return (
    <div class="outer-box">
      <form onSubmit={handleSubmit}>
        <label htmlFor="Patient">Patient</label>
        <input
          type="text"
          id="name"
          name="Patient"
          placeholder="Patient"
          value={Patient || ""}
          readOnly
        />

        <label htmlFor="Doctor">Doctor</label>
        <input
          type="name"
          id="Doctor"
          name="Doctor"
          placeholder="Doctor"
          value={Doctor || ""}
          readOnly
        />

        <label htmlFor="Test">Test</label>
        <input
          type="text"
          id="Test"
          name="Test"
          placeholder="Test"
          value={Test || ""}
          readOnly
        />

        <label htmlFor="Result">Result</label>
        <textarea 
          rows="4" cols="50"
          type="text"
          id="Result"
          name="Result"
          placeholder="Result"
          value={Result || ""}
          onChange={handleInputChange}
        />

       
        <input class="save-button" type="submit" value="Save" />
        
      </form>
      <input type="file" onChange={saveFile} />
         < button class="save-button" onClick={uploadFile}>Upload file</button>
         <Link to={backpath}>
          <input class="save-button" type="button" value="Go Back" />
        </Link>
    </div>
  );
}

export default DPupdateTest;
