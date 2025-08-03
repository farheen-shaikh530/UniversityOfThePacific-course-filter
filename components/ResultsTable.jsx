import React from "react";

const ResultsTable = ({ results }) => {
  if (results.length === 0) return null;

  return (
    <table border="1" cellPadding="8" style={{ marginTop: "20px", width: "100%" }}>
      <thead>
        <tr>
          <th>Partner Country</th>
          <th>Partner University</th>
          <th>Partner Course Code</th>
          <th>Partner Course Name</th>
        </tr>
      </thead>
      <tbody>
        {results.map((course, index) => (
          <tr key={index}>
            <td>{course.partner_country}</td>
            <td>{course.partner_university}</td>
            <td>{course.partner_course_code}</td>
            <td>{course.partner_course_name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ResultsTable;