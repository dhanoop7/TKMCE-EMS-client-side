import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from './pages/adminlogin';
import Navbar from './components/Navbar';
import AdminDashboard from './pages/AdminDashboard';
import Committee from './pages/Committee';
import EmployeeManagement from './pages/EmployeeManagement';
import CommitteeMain from './pages/CommitteeMain';
import GenerateCommitteeReport from './pages/GenerateCommitteeReport';
import CommitteeDetail from './pages/CommitteeDetail';


function App() {


  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<AdminLogin/>} />
        <Route path='/dashboard' element={<AdminDashboard/>} />
        <Route path='/committee-dashboard' element={<CommitteeMain />} />
        <Route path='/committee' element={<Committee />} />
        <Route path='/generate-report' element={<GenerateCommitteeReport />} />
        <Route path="/committee-detail/:id" element={<CommitteeDetail />} />
        <Route path='/employee' element={<EmployeeManagement />} />
      </Routes>
    </Router>
  )
}

export default App
