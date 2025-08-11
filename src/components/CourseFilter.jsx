import React, { useState, useEffect } from "react";
import ResultsTable from "./ResultsTable";
import UniversityAccordion from "./UniversityAccordion";

// ---- Google Sheets via GViz JSON ----
const SPREADSHEET_ID = "16qWmlJFOqy0AzZ4F76Cds8ch2VNHlN_n";
const GID_GENERAL = "1296735863";
const GID_MAJORS  = "265343630";

const sstr = (v) => (v == null ? "" : String(v));

// Fetch GViz JSON and unwrap setResponse(...)
async function fetchGvizJSON(gid) {
   

  const cb = Date.now(); // cache-buster
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&gid=${gid}&cb=${cb}`;

  const res = await fetch(url, { cache: "no-store" });
  const text = await res.text();

  if (text.trim().startsWith("<")) {
    throw new Error("GViz returned HTML — sheet not public?");
  }

  const json = JSON.parse(
    text.replace(/^[\s\S]*?setResponse\(/, "").replace(/\);?\s*$/, "")
  );
  return json.table;
}

// Convert GViz table → array of objects using header labels
function gvizToObjects(table) {
  const labels = table.cols.map((c) => (c?.label || "").trim());
  return table.rows.map((r) => {
    const cells = (r?.c || []).map((c) => (c ? c.v : ""));
    return Object.fromEntries(labels.map((lab, i) => [lab, cells[i]]));
  });
}
// Normalize a "General" row to stable keys your UI expects
function normalizeGeneralRow(r) {
  const pacNameRaw =
    r["pacific_course_name"] ??
    r['"pacific_course_name\n"'] ??
    r['"pacific_course_name"'] ?? "";

  return {
    partner_university: sstr(r.partner_university ?? r["partner university"]).trim(),
    country: sstr(r.country ?? r.Country).trim(),
    partner_course_code: sstr(r.partner_course_code ?? r["partner course code"]).trim(),
    partner_course_name: sstr(r.partner_course_name ?? r["partner course name"]).trim(),
    partner_course_credit: sstr(r.partner_course_credit ?? r.Partnere_course_credit).trim(),
    pacific_course_code: sstr(r.pacific_course_code ?? r["pacific course code"]).trim(),
    pacific_course_name: sstr(pacNameRaw).replace(/"/g, "").trim(),
    pacific_major: sstr(r.pacific_major ?? r["pacific major"]).trim(),
    pacific_course_credit: sstr(r.pacific_course_credit ?? r["pacific course credit"]).trim(),
    approval_term: sstr(r.approval_term ?? r["approval term"]).trim(),
    providers: sstr(r.providers ?? r.provider ?? r.Provider).trim(),
    __raw: r,
  };
}


function normalizeMajorsRows(rows) {
  return rows
    .map((m) => {
      if (typeof m === "string") return m;
      // pick the first non-empty cell in the row
      const firstVal = Object.values(m).find(v => v && String(v).trim() !== "");
      return firstVal || "";
    })
    .map(x => String(x).trim())
    .filter(Boolean)
    .sort();
}


const CourseFilter = () => {
  const [countries, setCountries] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [subjectAreas, setSubjectAreas] = useState([]);
  const [pacificCourseCode, setPacificCourseCode] = useState("");
  const [pacificSubjectAreas, setPacificSubjectAreas] = useState([]);
  const [uopSchools, setUopSchools] = useState([]);
  const [results, setResults] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedInstitution, setSelectedInstitution] = useState("");
  const [selectedSubjectArea, setSelectedSubjectArea] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("");
  const [selectedPacificSubjectArea, setSelectedPacificSubjectArea] = useState("");
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noMatchMessage, setNoMatchMessage] = useState("");
  const [showResults, setShowResults] = useState(false);

  const isSearchDisabled = !(
    selectedCountry ||
    selectedInstitution ||
    selectedSubjectArea ||
    selectedMajor ||
    selectedPacificSubjectArea ||
    pacificCourseCode
  );

  // ---- load data once ----
useEffect(() => {
  const load = async () => {
    try {
     
        console.log("Loading from GViz...");

      // Courses
      const generalTable = await fetchGvizJSON(GID_GENERAL);
      const generalRows  = gvizToObjects(generalTable);
      const normalized   = generalRows.map(normalizeGeneralRow);


      setAllCourses(normalized);
      setCountries([...new Set(normalized.map(r => r.country))].filter(Boolean).sort());
      setInstitutions([...new Set(normalized.map(r => r.partner_university))].filter(Boolean).sort());

      // Majors
      const majorsTable = await fetchGvizJSON(GID_MAJORS);
      const majorsRows  = gvizToObjects(majorsTable);
      console.log("majorsRows sample:", majorsRows.slice(0, 5));

      const majorsList  = normalizeMajorsRows(majorsRows);


  
      setUopSchools(majorsList);

 console.log(" Majors list:", majorsList.length, majorsList.slice(0, 10));



    } catch (e) {
      console.error("GViz load error:", e);
      setNoMatchMessage("Failed to load data from Google Sheets.");
    } finally {
      setLoading(false);
    }
  };
  load();
}, []);

//  Cascading effect for universities when country changes
useEffect(() => {
  console.log(" Selected Country=====", selectedCountry);
  
 if (!selectedCountry) {
    const allUnis = [...new Set(allCourses.map(r => r.partner_university))]
      .filter(Boolean)
      .sort();
    console.log(" Showing ALL universities:", allUnis.length);
    setInstitutions(allUnis);
    return;
  }

  const filteredUnis = [...new Set(
    allCourses
      .filter(r => (r.country || "").toLowerCase() === selectedCountry.toLowerCase())
      .map(r => r.partner_university)
  )]
    .filter(Boolean)
    .sort();

  console.log(` Universities for ${selectedCountry}:`, filteredUnis.length);
  setInstitutions(filteredUnis);
}, [selectedCountry, allCourses]);


  const handleClear = () => {
    setSelectedCountry("");
    setSelectedInstitution("");
    setSelectedSubjectArea("");
    setSelectedMajor("");
    setSelectedPacificSubjectArea("");
    setPacificCourseCode("");
    setResults([]);
    setShowTooltip(false);
    setShowResults(false);
    setNoMatchMessage("");
  };

  
  const handleFilter = () => {
    console.log("🔍 Filter parameters:", {
      selectedCountry,
      selectedInstitution,
      selectedSubjectArea,
      selectedMajor,
      selectedPacificSubjectArea,
      pacificCourseCode
    });

    const filtered = allCourses.filter((course) => {
      const cCountry = sstr(course.country).trim().toLowerCase();
      const selCountry = sstr(selectedCountry).trim().toLowerCase();

      const cUni = sstr(course.partner_university).trim();
      const selUni = sstr(selectedInstitution).trim();

      const cSub = sstr(course.partner_course_subject);
      const selSub = sstr(selectedSubjectArea);

      const cPacSub = sstr(course.pacific_subject_area);
      const selPacSub = sstr(selectedPacificSubjectArea);

      const cPacCode = sstr(course.pacific_course_code).toLowerCase();
      const selPacCode = sstr(pacificCourseCode).toLowerCase();

      const cMajor = sstr(course.pacific_major).trim().toLowerCase();
      const selMajor = sstr(selectedMajor).trim().toLowerCase();

      return (
        (!selectedCountry || cCountry === selCountry) &&
        (!selectedInstitution || cUni === selUni) &&
        (!selectedSubjectArea || cSub === selSub) &&
        (!selectedPacificSubjectArea || cPacSub === selPacSub) &&
        (!pacificCourseCode || cPacCode.includes(selPacCode)) &&
        (!selectedMajor || cMajor === selMajor)
      );
    });

    


    const grouped = filtered.reduce((acc, course) => {
      const key = `${course.partner_university}__${course.country}`;
      if (!acc[key]) {
        acc[key] = {
          partner_university: course.partner_university,
          country: course.country,
          courses: [],
        };
      }
      acc[key].courses.push(course);
      return acc;
    }, {});

    console.log("📦 Grouped Results:", grouped);

    const groupedArray = Object.values(grouped).map((uni) => {
      const providersSet = new Set();
      uni.courses.forEach((c) => c.providers && providersSet.add(c.providers));
      return { ...uni, providers: Array.from(providersSet) };
    });

    setResults(groupedArray);
    setShowResults(true);
    console.log("✅ Final Search Results:", groupedArray);

    setNoMatchMessage(
      groupedArray.length === 0
        ? `No courses in ${selectedCountry || "selected country"} for the selected major.`
        : ""
    );
  }; // <-- 🟢 CLOSE handleFilter here

  const dropdownStyle = {
  width: "90%",
  maxWidth: "400px",
  padding: "14px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "17px",
  lineHeight: "1.6",
  marginBottom: "20px",
  backgroundColor: "#e6ebf1",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  backgroundSize: "16px",
  appearance: "none",
  WebkitAppearance: "none",
  color: "#333",
};

  if (loading) return <div>Loading...</div>;

  return (
    <div
      style={{
        fontFamily: "Neuzeit Grotesk Regular, Ramaraj Regular",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "40px 20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      {/* Two-column layout */}
      <div
        style={{
          width: "90%",
          maxWidth: "1200px",
          display: "flex",
          justifyContent: "center",
          gap: "80px",
          alignItems: "flex-start",
          marginBottom: "40px",
        }}
      >
        {/* Pacific Courses */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            flex: 1,
            minHeight: "420px",
            minWidth: "400px",
          }}
        >
          <h3
            style={{
              fontSize: "26px",
              marginTop: "0px",
              marginBottom: "10px",
              textAlign: "left",
              fontFamily: "Bely Display",
            }}
          >
            Pacific Courses
          </h3>

          <label style={{ marginTop: "42px", marginBottom: "8px", fontFamily: "Ramaraja Regular" }}>
            Majors:
          </label>

          <select
            value={selectedMajor}
            onChange={(e) => setSelectedMajor(e.target.value)}
            style={dropdownStyle}
          >
            <option value=""> </option>
            {uopSchools.map((s, i) => (
              <option key={`${s}-${i}`} value={s}>
                {s}
              </option>
            ))}
          </select>

          <label style={{ marginBottom: "8px", fontFamily: "Ramaraja Regular" }}>
            Course Code:
          </label>
          <input
            type="text"
            value={pacificCourseCode}
            onChange={(e) => setPacificCourseCode(e.target.value)}
            placeholder="e.g., HIST 120"
            style={{
              padding: "10px",
              fontSize: "14px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              width: "76%",
              maxWidth: "400px",
              height: "35px",
              maxHeight: "50px",
              marginBottom: "20px",
              backgroundColor: "#f9f9f9",
            }}
          />
        </div>

        {/* International Course Equivalents */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            flex: 1,
            minHeight: "420px",
            minWidth: "400px",
          }}
        >
          <h3
            style={{
              fontSize: "26px",
              marginTop: "0px",
              marginBottom: "10px",
              textAlign: "left",
              fontFamily: "Bely Display",
            }}
          >
            International Course Equivalents
          </h3>

          <label style={{ marginTop: "42px", marginBottom: "8px", fontFamily: "Ramaraja Regular" }}>
            Country:
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            style={dropdownStyle}
          >
            <option value=""> </option>
            {countries.map((c, i) => (
              <option key={`${c}-${i}`} value={c}>
                {c}
              </option>
            ))}
          </select>

          <label>University / Institution:</label>
          <select
            value={selectedInstitution}
            onChange={(e) => setSelectedInstitution(e.target.value)}
            style={dropdownStyle}
          >
            <option value=""> </option>
            {institutions.map((iName, i) => (
              <option key={`${iName}-${i}`} value={iName}>
                {iName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginBottom: "0px",
          alignItems: "flex-start",
        }}
      >
        <button
          onClick={handleFilter}
          disabled={isSearchDisabled}
          title="Please be more specific in your search"
          style={{
            backgroundColor: "#E65300",
            color: "#fff",
            border: "none",
            padding: "10px 28px",
            fontWeight: "bold",
            fontSize: "16px",
            borderRadius: "6px",
            width: "120px",
            cursor: isSearchDisabled ? "not-allowed" : "pointer",
            opacity: isSearchDisabled ? 0.6 : 1,
          }}
        >
          Search
        </button>

        <button
          onClick={handleClear}
          style={{
            backgroundColor: " #A29889",
            color: "#fff",
            border: "none",
            padding: "10px 28px",
            fontWeight: "bold",
            fontSize: "16px",
            borderRadius: "6px",
            width: "120px",
            cursor: "pointer",
          }}
        >
          Clear
        </button>
      </div>

      {showResults && results.length > 0 && (
        <UniversityAccordion universities={results} />
      )}

      {showResults && results.length === 0 && noMatchMessage && (
        <div
          style={{
            marginTop: "20px",
            padding: "14px",
            backgroundColor: "#f6f6f6",
            borderLeft: "4px solid #E65300",
            borderRadius: "4px",
            fontSize: "16px",
            color: "#333",
            width: "85%",
            fontFamily: "Neuzeit Grotesk Light",
          }}
        >
          {noMatchMessage}
        </div>
      )}
    </div>
  );
};


export default CourseFilter;