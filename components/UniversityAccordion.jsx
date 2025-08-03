import React, { useState } from "react";

const UniversityAccordion = ({ universities }) => {
  return (
    <div style={{ maxWidth: "800px", margin: "40px auto" }}>
      
      {universities.map((uni, index) => {
        const [open, setOpen] = useState(false); // Local to each accordion
        return (
          <div
            key={index}
            style={{
              marginBottom: "12px",
              borderRadius: "8px",
              background: "#f8f8f8",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <button
              onClick={() => setOpen((prev) => !prev)}
              style={{
                background: "white",
                border: "none",
                padding: "15px 20px",
                width: "100%",
                textAlign: "left",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                color: "#14447D",
                borderBottom: open ? "1px solid #ddd" : "none",
              }}
            >
              ▶ {uni.partner_university} ({uni.country})
            </button>
            {open && (
              <div style={{ padding: "15px 20px", backgroundColor: "#fff" }}>
                <p style={{ margin: 0 }}>Details coming soon...</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default UniversityAccordion;