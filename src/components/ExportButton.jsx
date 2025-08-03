import React from "react";

const ExportButton = ({ results }) => {
  const handleExport = () => {
    const headers = [
      "Country",
      "Partner University",
      "Partner Course Code",
      "Partner Course Name",
      "Pacific Course Code",
      "Pacific Course Name",
    ];
    const rows = results.map((r) =>
      [
        r.country,
        r.partner_university,
        r.partner_course_code,
        r.partner_course_name,
        r.pacific_course_code,
        r.pacific_course_name,
      ].join(",")
    );
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "Course_Results.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!results || results.length === 0) return null;

  return (
<button
  onClick={handleExport}
  style={{
    marginTop: "20px",
    padding: "12px 24px",
    backgroundColor: "#FF671D",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    fontFamily: "Neuzeit Grotesk Bold",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.3s ease"
  }}
  onMouseOver={(e) => e.target.style.backgroundColor = "#E65300"}
  onMouseOut={(e) => e.target.style.backgroundColor = "#FF671D"}
>
  Export to CSV
</button>
  );
};

export default ExportButton;