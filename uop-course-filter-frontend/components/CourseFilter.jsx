//components/CourseFilter.jsx
import React from "react";

const CourseFilter = () => {
  return (
    <div style={{ maxWidth: "1000px", margin: "40px auto", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", gap: "40px", justifyContent: "space-between" }}>
        
        {/* Left Column: Partner University */}
        <div style={{ flex: 1 }}>
          <h3>Partner University</h3>

          <label>Country:</label><br />
          <select style={{ width: "100%", padding: "8px", marginBottom: "15px" }}>
            <option value="">Select Country</option>
            <option value="Israel">Israel</option>
            <option value="Germany">Germany</option>
            <option value="Japan">Japan</option>
          </select><br />

          <label>Institution:</label><br />
          <select style={{ width: "100%", padding: "8px", marginBottom: "15px" }}>
            <option value="">Select Institution</option>
            <option value="Hebrew University">Hebrew University</option>
            <option value="Tokyo University">Tokyo University</option>
          </select><br />

          <label>Subject Area:</label><br />
          <select style={{ width: "100%", padding: "8px", marginBottom: "15px" }}>
            <option value="">Select Subject</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Business">Business</option>
          </select><br />
        </div>

        {/* Right Column: Pacific Equivalent */}
        <div style={{ flex: 1 }}>
          <h3>Pacific Equivalent</h3>

          <label>Pacific Course Code:</label><br />
          <input
            type="text"
            placeholder="e.g. CSCI 161"
            style={{ width: "100%", padding: "8px", marginBottom: "15px" }}
          /><br />

          <label>Pacific Course Name:</label><br />
          <input
            type="text"
            placeholder="e.g. Intro to Programming"
            style={{ width: "100%", padding: "8px", marginBottom: "15px" }}
          /><br />
        </div>
      </div>
    </div>
  );
};

export default CourseFilter;