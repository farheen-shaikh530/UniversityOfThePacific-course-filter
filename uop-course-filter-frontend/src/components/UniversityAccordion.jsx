import React, { useState } from "react";

 const tableHeaderStyle = {
  padding: "16px 8px",
  fontSize: "14px",
  width: "120px",
  maxWidth: "150px",
  textAlign: "left",
  fontWeight: "bold",
  backgroundColor: "#A29889",
  color: "white",
};


const tableCellStyle = {
  
  padding: "16px 8px",            // Increase vertical padding (height)
  fontSize: "14px",
  width: "120px",                 // Set a smaller fixed width
  maxWidth: "150px",             // Optional: restrict how wide it can grow
  whiteSpace: "normal",          // Allow wrapping
  wordBreak: "break-word",       // Prevent overflow
  borderBottom: "1px solid #ccc",

};

const UniversityAccordion = ({ universities = [] }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };


 return (
    <div style={{ marginTop: "30px", width: "100%", gap: "20px" }}>
      {universities.map((uni, index) => {
        const matchedCourses = Array.isArray(uni.courses) ? uni.courses : [];

        return (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              marginBottom: "20px",
              background: "#f9f9f9",
              width: "90%",
              margin: "0 auto",
              minHeight: "90px",
              padding: "0",
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
          >
            <div
              onClick={() => toggleAccordion(index)}
              style={{
                cursor: "pointer",
                padding: "20px 24px",
                fontWeight: "bold",
                fontSize: "18px",
                lineHeight: "1.4",
                backgroundColor: "#E65300",
                color: "white",
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
              }}
            >
  {openIndex === index ? "▾" : "▸"} {uni.partner_university}
  {" ("}
  {uni.country}
  {uni.providers && uni.providers.length > 0 && ` — ${uni.providers.join(", ")}`}
  {")"}


            </div>

            {openIndex === index && (
              <div style={{ padding: "16px", background: "#fff" }}>
                {matchedCourses.length === 0 ? (
                  <p style={{ color: "#888" }}>No course mappings available.</p>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                    <thead>
                      <tr>
                        <th style={tableHeaderStyle}>Pacific Major</th>
                        <th style={tableHeaderStyle}>Pacific Class Code</th>
                         <th style={tableHeaderStyle}>Pacific Class Title</th> 
                       
                      
                      <th style={tableHeaderStyle}>Pacific Credit</th>
                        <th style={tableHeaderStyle}>Class Code</th>
                        <th style={tableHeaderStyle}>Class Title</th>
                         <th style={tableHeaderStyle}>Approval Period</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matchedCourses.map((course, i) => (
                        <tr key={i}>
                           <td style={tableCellStyle}>{course.pacific_major}</td>
                          <td style={tableCellStyle}>{course.pacific_course_code}</td>
                          <td style={tableCellStyle}> {course.pacific_course_name ? course.pacific_course_name : <span style={{ color: "red" }}>No name</span>} </td>
                          <td style={tableCellStyle}>{course.pacific_course_credit ? course.pacific_course_credit : <span style={{ color: "red" }}>N/A</span>}</td>
                          <td style={tableCellStyle}>{course.partner_course_code}</td>
                          <td style={tableCellStyle}>{course.partner_course_name}</td>
                          <td style={tableCellStyle}> {course.approval_term ? course.approval_term : <span style={{ color: "red" }}>No term</span>}</td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default UniversityAccordion;