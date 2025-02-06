import "./App.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/SideBar";
import Home from "./pages/Home";

// Import ProtectedRoute

function App() {
  return (
    <div>
      <Navbar />
      <Home/>
    </div>
  );
}

export default App;
