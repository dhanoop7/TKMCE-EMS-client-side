import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from './pages/adminlogin';
import Navbar from './components/Navbar';
import AdminDashboard from './pages/AdminDashboard';
import Committee from './pages/Committee';
import EmployeeManagement from './pages/EmployeeManagement';
import CommitteeMain from './pages/CommitteeMain';
import GenerateCommitteeReport from './pages/GenerateCommitteeReport';
import CommitteeDetail from './pages/CommitteeDetail';
import ProtectedRoute from './components/ProtectedRoute';
import CommitteeMembersAdd from './pages/CommitteeMembersAdd';
import AddSubCommittee from './pages/AddSubCommittee';
import UnderMaintenance from './pages/UnderMaintenance';
import Unauthorized from './pages/Unauthorized';
import ListEmployee from './pages/ListEmployee';
import EditSubCcommittee from './pages/EditSubCcommittee';

 // Import ProtectedRoute

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        
        {/* Protected Routes */}
        <Route path='/unauthorized' element={<Unauthorized />} />
        <Route path="/admin-dashboard" element={<ProtectedRoute element={AdminDashboard} />} />
        <Route path="/committee-dashboard" element={<ProtectedRoute element={CommitteeMain} />} />
        <Route path="/committee" element={<ProtectedRoute element={Committee} />} />
        <Route path="/add-members/:committe_id" element={<ProtectedRoute element={CommitteeMembersAdd} />} />
        <Route path="/add-subcommittee/:id" element={<ProtectedRoute element={AddSubCommittee} />} />
        <Route path="/edit-subcommittee/:committeeId/:subcommitteeId" element={<ProtectedRoute element={EditSubCcommittee} />} />
        {/* <Route path="/add-members" element={<ProtectedRoute element={CommitteeMembersAdd} />} /> */}
        <Route path="/under-maintenance" element={<ProtectedRoute element={UnderMaintenance} /> } />
        <Route path="/generate-report" element={<ProtectedRoute element={GenerateCommitteeReport} />} />
        <Route path="/committee-detail/:id" element={<ProtectedRoute element={CommitteeDetail} />} />
        <Route path="/employee" element={<ProtectedRoute element={EmployeeManagement} />} />
        <Route path='/list-employee' element={<ProtectedRoute element={ListEmployee} />} />
      </Routes>
    </Router>
  );
}

export default App;
