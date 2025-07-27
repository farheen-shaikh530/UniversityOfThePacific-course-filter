import React from "react";

const ExportButton = ({ results }) => {
  const handleExport = () => {
    const headers = ["Partner Country", "Partner University", "Partner Course Code", "Partner Course Name"];
    const rows = results.map((r) =>
      [r.partner_country, r.partner_university, r.partner_course_code, r.partner_course_name].join(",")
    );
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "course_results.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (results.length === 0) return null;

  return (
    <button
      onClick={handleExport}
      style={{ marginTop: "10px", padding: "10px", fontSize: "16px", cursor: "pointer" }}
    >
      Export to CSV
    </button>
  );
};

export default ExportButton;
