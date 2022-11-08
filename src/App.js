import React from "react";
import Navbar from "./Components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import Clubs from "./Components/Clubs";
import Fixtures from "./Components/Fixtures";
import Gallery from "./Components/Gallery";
import News from "./Components/News";
import Results from "./Components/Results";
import FooterSection from "./Components/Footer";
import { AuthContextProvider } from "./Components/context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import Signin from "./Components/Signin";
// import Signup from "./Components/Signup";
// import "./index.css";
// import '../src/Components/Table.css'
import Admin from "./Components/Admin";
// import "bulma/css/bulma.min.css";
import './Components/Table.css'
import './App.css'


const App = () => {
  // const [showFooter, setshowFooter] = useState(true)

  // const smoothDropdown = () => {
  //   return <FooterSection/>
  // }

  return (
    <>
    <div className="">

   
      <AuthContextProvider>
        <Router>
       
          <Navbar />
          
      {/* <main style={{ flex: 1}}> */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/clubs" element={<Clubs />} />
            <Route path="/fixtures" element={<Fixtures />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/news" element={<News />} />
            <Route path="/results" element={<Results />} />
            <Route path="/signin" element={<Signin />} />
            {/* <Route path="/signup" element={<Signup />} /> */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
          </Routes>
           {/* </main> */}
         
          
          <FooterSection />
           </Router>
      </AuthContextProvider>
      </div>
    </>
    
  );
};

export default App;
