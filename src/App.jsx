import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from './pages/adminlogin';
import Navbar from './components/Navbar';
import AdminDashboard from './pages/AdminDashboard';
import Committee from './pages/Committee';


function App() {


  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<AdminLogin/>} />
        <Route path='/dashboard' element={<AdminDashboard/>} />\
        <Route path='/committee' element={<Committee />} />
      </Routes>
    </Router>
  )
}

export default App
