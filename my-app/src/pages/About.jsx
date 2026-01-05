export default function About() {
  return (
    <div style={{
      background: "white",
      borderRadius: "12px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      padding: "30px",
      maxWidth: "900px",
      margin: "0 auto",
      color: "#2c3e50"
    }}>
      <h1 style={{
        fontSize: "2em",
        fontWeight: "700",
        marginBottom: "30px",
        color: "#667eea",
        textAlign: "center"
      }}>ℹ️ About This Application</h1>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{
          fontSize: "1.4em",
          fontWeight: "600",
          marginBottom: "12px",
          color: "#34495e"
        }}>👤 Author</h2>
        <p style={{ 
          fontSize: "1.1em",
          lineHeight: "1.6",
          color: "#2c3e50"
        }}>Created by <strong style={{ color: "#667eea" }}>Ufuk Bayram Coşkun</strong>.</p>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{
          fontSize: "1.4em",
          fontWeight: "600",
          marginBottom: "12px",
          color: "#34495e"
        }}>📖 How to Use</h2>
        <p style={{ 
          fontSize: "1.1em",
          lineHeight: "1.6",
          color: "#2c3e50"
        }}>
          The application is designed to be intuitive and straightforward.
          The interface clearly shows how to interact with the available features,
          so no separate user manual is required.
          2 clicks on the task name open the rename panel for changing it
          And 1 click on the task name opens the activity intervals
        </p>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2 style={{
          fontSize: "1.4em",
          fontWeight: "600",
          marginBottom: "12px",
          color: "#34495e"
        }}>📜 Content and Licensing</h2>
        <p style={{ 
          fontSize: "1.1em",
          lineHeight: "1.6",
          color: "#2c3e50"
        }}>
          All visual and textual content used in this application was created by the author.
          No third-party materials requiring a license have been used.
        </p>
      </section>

      <section>
        <h2 style={{
          fontSize: "1.4em",
          fontWeight: "600",
          marginBottom: "12px",
          color: "#34495e"
        }}>🤖 Use of AI Tools</h2>
        <p style={{ 
          fontSize: "1.1em",
          lineHeight: "1.6",
          color: "#2c3e50"
        }}>
          AI tools (ChatGpt 4o, Google Gemini 2.5 pro, cloude sonnet 4.5) were used for generating short explanations, syntax
          check, and debugging assistance. Also ask some design ideas like color choices. All final implementation decisions and the
          complete application code were written by the author.
        </p>
      </section>
    </div>
  );
}
