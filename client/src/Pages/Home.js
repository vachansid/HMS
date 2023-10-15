import React from 'react'
import { Link } from 'react-router-dom';
function Home() {
  
    return (
      <body>
      <div>
        <div className="outer-box1">
        <br/>
        <h1 style={{}}>Hospital Management System</h1>
        <Link to="/Login">
          <button style={{padding: 15,fontSize:20,borderRadius: 15}}>Get Started</button>
        </Link>
      </div>
      </div>
      </body>
    );
  
}

// import React from 'react';
// import { Link, Route, Routes } from 'react-router-dom';
// import Slider from 'react-slick';

// import LoginForm from './Login';
// import FrontDeskOperatorPage from './Frontdesk';
// import DataEntryOperatorPage from './Dataentry';
// import DoctorPage from './Doctor';
// import DatabaseAdministratorPage from './Dbadmin';

// // Slider settings
// const settings = {
//   dots: true,
//   infinite: true,
//   speed: 500,
//   slidesToShow: 1,
//   slidesToScroll: 1,
// };

// const Home = () => {
//   const token = localStorage.getItem('token');
//   const userType = localStorage.getItem('userType');

//   const isLoggedIn = !!token;

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('userType');
//   };

//   return (
//     <div>
//       <nav>
//         <ul>
//           <li>
//             <Link to="/">Home</Link>
//           </li>
//           {!isLoggedIn ? (
//             <li>
//               <Link to="/login">Login</Link>
//             </li>
//           ) : (
//             <li>
//               <button onClick={handleLogout}>Logout</button>
//             </li>
//           )}
//         </ul>
//       </nav>

//       <Routes>
//         <Route path="/Frontdesk">
//           {userType === 'front_desk_operators' ? (
//             <FrontDeskOperatorPage />
//           ) : (
//             <h2>Access Denied</h2>
//           )}
//         </Route>
//         <Route path="/Dataentry">
//           {userType === 'data_entry_operators' ? (
//             <DataEntryOperatorPage />
//           ) : (
//             <h2>Access Denied</h2>
//           )}
//         </Route>
//         <Route path="/Doctor">
//           {userType === 'doctors' ? <DoctorPage /> : <h2>Access Denied</h2>}
//         </Route>
//         <Route path="/Dbadmin">
//           {userType === 'database_administrators' ? (
//             <DatabaseAdministratorPage />
//           ) : (
//             <h2>Access Denied</h2>
//           )}
//         </Route>
//         <Route path="/">
//           <div>
//             <h1>Welcome to Hospital Management System</h1>
//             <Slider {...settings}>
//               <div>
//                 <img src="/slider1.jpg" alt="Slider 1" />
//               </div>
//               <div>
//                 <img src="/slider2.jpg" alt="Slider 2" />
//               </div>
//               <div>
//                 <img src="/slider3.jpg" alt="Slider 3" />
//               </div>
//             </Slider>
//           </div>
//         </Route>
//       </Routes>
//     </div>
//   );
// };

export default Home;

