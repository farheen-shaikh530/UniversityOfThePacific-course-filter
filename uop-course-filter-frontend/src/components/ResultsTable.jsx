import React from "react";



const ResultsTable = ({ results, selectedCountry }) => {
  if (results.length === 0) return null;

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Ramaraja, serif",
      }}
    >
      {/* 🔵 Header similar to image */}
      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: "14px 18px",
          fontSize: "20px",
          fontWeight: 600,
          color: "#1b4e8c",
          borderRadius: "6px",
          border: "1px solid #d1d1d1",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
          marginBottom: "16px",
        }}
      >
        Universities in {selectedCountry}:
      </div>

      {/* 📊 Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "white",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#FF671D", color: "white", fontSize: "16px" }}>
            <th style={{ padding: "12px" }}>University Name</th>
            <th style={{ padding: "12px" }}>Country</th>
          </tr>
        </thead>
        <tbody>
          {results.map((course, idx) => (
            <tr
              key={idx}
              style={{
                borderBottom: "1px solid #eee",
                backgroundColor: idx % 2 === 0 ? "#fdfdfd" : "#fff",
              }}
            >
              <td style={{ padding: "12px" }}>{course.partner_university}</td>
              <td style={{ padding: "12px" }}>{course.country}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsTable;
