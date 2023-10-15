import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Login from './Pages/Login';
import Home from './Pages/Home'
import Doctor from './Pages/Doctor';
import Frontdesk from './Pages/Frontdesk'
import Dbadmin from './Pages/Dbadmin'
import Dbcreate from './Pages/Dbcreate';
import PatientReg from './Pages/PatientReg';
import Appointment from './Pages/Appointment';
import ShowAppointments from './Pages/ShowAppointments';
import TestScheduling from './Pages/TestScheduling';
import RoomAllotment from './Pages/RoomAllotment';
import TreatmentScheduling from './Pages/TreatmentScheduling';
import PatientsDashboard from './Pages/PatientsDashboard';
import Dentry from "./Pages/Dentry";
import DPinfo from "./Pages/DPinfo";
import DPupdateTest from "./Pages/DPupdateTest";
import DPupdateTreatment from "./Pages/DPupdateTreatment";
import Navbar from './Pages/Navbar';

import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {

  return (
    <div className="App"> 
         <Router>
         <Navbar />
         <ToastContainer position='top-center'></ToastContainer>
          <Routes>
           <Route exact path='/' element={<Home/>}/>
           <Route exact path='/Login' element={<Login/>}/>
           <Route exact path="/Doctor" element={<Doctor />} />
           <Route exact path='/Doctor/:Doctor_id' element={<Doctor/>}/>
           <Route exact path='/Doctor/:Doctor_id/Appointments/:type' element={<ShowAppointments/>}/>
           <Route exact path='/Doctor/:Doctor_id/Patients' element={<PatientsDashboard/>}/>
           <Route exact path='/Frontdesk' element={<Frontdesk/>}/>
           <Route exact path='/Frontdesk/PatientReg' element={<PatientReg/>}/>
           <Route exact path='/Frontdesk/bookAppointment' element={<Appointment/>}/>
           <Route exact path='/Frontdesk/TestScheduling' element={<TestScheduling/>}/>
           <Route exact path='/Frontdesk/TreatmentScheduling' element={<TreatmentScheduling/>}/>
           <Route exact path='/Frontdesk/RoomAllotment' element={<RoomAllotment/>}/>
           <Route exact path='/Dbadmin' element={<Dbadmin/>}/>
           <Route exact path='/Dbupdate/:userID' element={<Dbcreate/>}/>
           <Route exact path="/Dbcreate" element={<Dbcreate />} />
          <Route exact path="/Dbupdate/:userID" element={<Dbcreate />} />
          <Route exact path="/Dentry" element={<Dentry />} />
          <Route exact path="/DPinfo/:patientID" element={<DPinfo />} />
          <Route
            exact
            path="/DPupdateTest/:PT_id"
            element={<DPupdateTest />}
          />
          <Route
            exact
            path="/DPupdateTreatment/:U_id"
            element={<DPupdateTreatment />}
          />
          </Routes> 
         </Router>
    </div>
  );
}

export default App;
