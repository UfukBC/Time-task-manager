export default function Home() {
    return (
      <div style={{
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        padding: "30px",
        maxWidth: "1000px",
        margin: "0 auto",
        color: "#2c3e50"
      }}>
        <h1 style={{
          fontSize: "2.5em",
          fontWeight: "700",
          color: "#667eea",
          marginBottom: "15px",
          textAlign: "center"
        }}>🏠 Welcome to Task Manager</h1>
        
        <p style={{
          fontSize: "1.1em",
          color: "#34495e",
          lineHeight: "1.6",
          textAlign: "center",
          marginBottom: "40px"
        }}>
          Your all-in-one solution for managing tasks efficiently and tracking your productivity.
        </p>

        {/* Feature Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "25px",
          marginBottom: "30px"
        }}>
          {/* Task Management */}
          <div style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "10px",
            padding: "25px",
            color: "white",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
          }}>
            <div style={{ fontSize: "3em", marginBottom: "10px" }}>📋</div>
            <h3 style={{ fontSize: "1.3em", marginBottom: "10px", fontWeight: "600" }}>Task Management</h3>
            <p style={{ fontSize: "0.95em", lineHeight: "1.5", opacity: 0.9 }}>
              Create, edit, and organize tasks with custom tags, priorities, and deadlines.
            </p>
          </div>

          {/* Activity Tracking */}
          <div style={{
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            borderRadius: "10px",
            padding: "25px",
            color: "white",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
          }}>
            <div style={{ fontSize: "3em", marginBottom: "10px" }}>⏱️</div>
            <h3 style={{ fontSize: "1.3em", marginBottom: "10px", fontWeight: "600" }}>Activity Intervals</h3>
            <p style={{ fontSize: "0.95em", lineHeight: "1.5", opacity: 0.9 }}>
              Track time spent on tasks with activity intervals and overlap detection.
            </p>
          </div>

          {/* Analytics */}
          <div style={{
            background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            borderRadius: "10px",
            padding: "25px",
            color: "white",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
          }}>
            <div style={{ fontSize: "3em", marginBottom: "10px" }}>📊</div>
            <h3 style={{ fontSize: "1.3em", marginBottom: "10px", fontWeight: "600" }}>Visual Analytics</h3>
            <p style={{ fontSize: "0.95em", lineHeight: "1.5", opacity: 0.9 }}>
              View daily activity charts and task summaries to track your productivity.
            </p>
          </div>
        </div>

        {/* Key Features List */}
        <div style={{
          background: "#f8f9fa",
          borderRadius: "10px",
          padding: "25px",
          marginBottom: "20px"
        }}>
          <h2 style={{
            fontSize: "1.5em",
            color: "#667eea",
            marginBottom: "20px",
            fontWeight: "600",
            textAlign: "center"
          }}>✨ Key Features</h2>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "15px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "1.5em" }}>🏷️</span>
              <span style={{ color: "#2c3e50" }}>Custom tags and categories</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "1.5em" }}>🔔</span>
              <span style={{ color: "#2c3e50" }}>Priority levels and deadlines</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "1.5em" }}>🔍</span>
              <span style={{ color: "#2c3e50" }}>Advanced filtering options</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "1.5em" }}>📈</span>
              <span style={{ color: "#2c3e50" }}>Daily activity bar charts</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "1.5em" }}>⚡</span>
              <span style={{ color: "#2c3e50" }}>Overlap detection system</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "1.5em" }}>📱</span>
              <span style={{ color: "#2c3e50" }}>Responsive design</span>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div style={{
          textAlign: "center",
          padding: "20px"
        }}>
          <p style={{
            fontSize: "1.2em",
            color: "#667eea",
            fontWeight: "600",
            marginBottom: "15px"
          }}>
            Ready to boost your productivity?
          </p>
          <p style={{
            fontSize: "1em",
            color: "#34495e",
            marginBottom: "10px"
          }}>
            Click on <strong style={{ color: "#667eea" }}>📋 Tasks</strong> in the navigation bar to get started!
          </p>
        </div>
      </div>
    );
  }