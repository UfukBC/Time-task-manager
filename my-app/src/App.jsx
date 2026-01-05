import { Routes, Route, Link, useLocation } from "react-router-dom";
import Tasks from "./pages/Tasks";
import About from "./pages/About";
import Home from "./pages/Home.jsx";

export default function App() {
  const location = useLocation();
  
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <nav style={{ 
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px 0",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        position: "sticky",
        top: 0,
        zIndex: 1000
      }}>
        <div style={{ 
          maxWidth: "1200px", 
          margin: "0 auto", 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center",
          gap: "30px",
          padding: "0 20px",
          flexWrap: "wrap"
        }}>
          <Link 
            to="/" 
            style={{ 
              color: "white",
              textDecoration: "none",
              fontSize: "18px",
              fontWeight: location.pathname === "/" ? "700" : "500",
              padding: "10px 24px",
              borderRadius: "25px",
              background: location.pathname === "/" ? "rgba(255, 255, 255, 0.25)" : "transparent",
              backdropFilter: "blur(10px)",
              transition: "all 0.3s ease",
              border: location.pathname === "/" ? "2px solid rgba(255, 255, 255, 0.3)" : "2px solid transparent",
              boxShadow: location.pathname === "/" ? "0 4px 15px rgba(0, 0, 0, 0.2)" : "none"
            }}
            onMouseOver={(e) => {
              if (location.pathname !== "/") {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
              }
            }}
            onMouseOut={(e) => {
              if (location.pathname !== "/") {
                e.currentTarget.style.background = "transparent";
              }
            }}
          >
            📋 Tasks
          </Link>
          
          <Link 
            to="/about" 
            style={{ 
              color: "white",
              textDecoration: "none",
              fontSize: "18px",
              fontWeight: location.pathname === "/about" ? "700" : "500",
              padding: "10px 24px",
              borderRadius: "25px",
              background: location.pathname === "/about" ? "rgba(255, 255, 255, 0.25)" : "transparent",
              backdropFilter: "blur(10px)",
              transition: "all 0.3s ease",
              border: location.pathname === "/about" ? "2px solid rgba(255, 255, 255, 0.3)" : "2px solid transparent",
              boxShadow: location.pathname === "/about" ? "0 4px 15px rgba(0, 0, 0, 0.2)" : "none"
            }}
            onMouseOver={(e) => {
              if (location.pathname !== "/about") {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
              }
            }}
            onMouseOut={(e) => {
              if (location.pathname !== "/about") {
                e.currentTarget.style.background = "transparent";
              }
            }}
          >
            ℹ️ About
          </Link>
          
          <Link 
            to="/home" 
            style={{ 
              color: "white",
              textDecoration: "none",
              fontSize: "18px",
              fontWeight: location.pathname === "/home" ? "700" : "500",
              padding: "10px 24px",
              borderRadius: "25px",
              background: location.pathname === "/home" ? "rgba(255, 255, 255, 0.25)" : "transparent",
              backdropFilter: "blur(10px)",
              transition: "all 0.3s ease",
              border: location.pathname === "/home" ? "2px solid rgba(255, 255, 255, 0.3)" : "2px solid transparent",
              boxShadow: location.pathname === "/home" ? "0 4px 15px rgba(0, 0, 0, 0.2)" : "none"
            }}
            onMouseOver={(e) => {
              if (location.pathname !== "/home") {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
              }
            }}
            onMouseOut={(e) => {
              if (location.pathname !== "/home") {
                e.currentTarget.style.background = "transparent";
              }
            }}
          >
            🏠 Home
          </Link>
        </div>
      </nav>

      <div style={{ 
        flex: 1, 
        display: "flex", 
        justifyContent: "center",
        padding: "20px",
        background: "#f5f7fa"
      }}>
        <div style={{ 
          width: "100%", 
          maxWidth: "1200px"
        }}>
          <Routes>
            <Route path="/" element={<Tasks />} />
            <Route path="/about" element={<About />} />
            <Route path="/home" element={<Home />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
