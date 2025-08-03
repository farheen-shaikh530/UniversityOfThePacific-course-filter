import React, { useState, useEffect } from "react";
import ResultsTable from "./ResultsTable";
import UniversityAccordion from "./UniversityAccordion";

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
  const [filteredUniversities, setFilteredUniversities] = useState([]);
 const [noMatchMessage, setNoMatchMessage] = useState(""); 
 
  const isSearchDisabled = !(
    selectedCountry ||
    selectedInstitution ||
    selectedSubjectArea ||
    selectedMajor ||
    selectedPacificSubjectArea ||
    pacificCourseCode );

  const [searchClicked, setSearchClicked] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const dropdownStyle = {
  width: "90%",
  maxWidth: "400px",

  padding: "14px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "17px",
  lineHeight: "1.6",
  marginBottom: "20px",
  backgroundColor: "#fff",
  backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='%23232323' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  backgroundSize: "16px",
  appearance: "none",        
  WebkitAppearance: "none",
  backgroundColor: "#e6ebf1",
  border: "1px solid #bbb",
  color: "#333",

  };

  const handleClear = () => {
    setSelectedCountry("");
    setSelectedInstitution("");
    setSelectedSubjectArea("");
    setSelectedMajor("");
    setSelectedPacificSubjectArea("");
    setPacificCourseCode("");
    setResults([]);
    setShowTooltip(false);
  };

useEffect(() => {
  const loadAll = async () => {
    try {
  
     const uopMajorsRes = await fetch("/uop_majors.json");
const majorsData = await uopMajorsRes.json();
setUopSchools(majorsData.majors);

      // Load international university data
      const equivalentsRes = await fetch("/international_universities.json");
      const courseEquivalentsData = await equivalentsRes.json();

      const universitiesWithCourses = courseEquivalentsData.universities.filter(
        (uni) => Array.isArray(uni.courses) && uni.courses.length > 1
      );

      // Flatten all courses
      const flatCourses = universitiesWithCourses.flatMap((uni) =>
        uni.courses.map((course) => ({
          ...course,
          partner_university: uni.partner_university,
          country: uni.country,
        }))
      );

      setAllCourses(flatCourses);

      // Set dropdown values
      const uniqueCountries = [
        ...new Set(universitiesWithCourses.map((u) => u.country))
      ].sort();

      const uniqueInstitutions = [
        ...new Set(universitiesWithCourses.map((u) => u.partner_university))
      ].sort();

      setCountries(uniqueCountries);
      setInstitutions(uniqueInstitutions);
    } catch (error) {
      console.error(" Error loading course data:", error);
    } finally {
      setLoading(false);
    }
  };

  loadAll();
}, []);


useEffect(() => {
  if (selectedCountry && allCourses.length > 0) {
    const matchedUnis = allCourses.filter(
      (course) => course.country === selectedCountry
    );

    const uniMap = new Map();

    matchedUnis.forEach((entry) => {
      const key = `${entry.partner_university}_${entry.country}`;

      if (!uniMap.has(key)) {
        uniMap.set(key, {
          partner_university: entry.partner_university,
          country: entry.country,
          courses: [],
          providersSet: new Set(),
        });
      }

      uniMap.get(key).courses.push(entry);

      if (entry.providers) {
        uniMap.get(key).providersSet.add(entry.providers);
      }
    });

 
    const universitiesWithProviders = Array.from(uniMap.values()).map((uni) => ({
      ...uni,
      providers: Array.from(uni.providersSet),
    }));

    setFilteredUniversities(universitiesWithProviders);

    console.log("Filtered with providers:", universitiesWithProviders);

  } else {
    setFilteredUniversities([]);
  }
}, [selectedCountry, allCourses]);



const handleFilter = () => {
  const filtered = allCourses.filter((course) => {
    return (
    (!selectedCountry || (course.country || "").trim().toLowerCase() === selectedCountry.trim().toLowerCase()) &&
    (!selectedInstitution || (course.partner_university || "").trim() === selectedInstitution.trim()) &&
    (!selectedSubjectArea || (course.partner_course_subject || "") === selectedSubjectArea) &&
    (!selectedPacificSubjectArea || (course.pacific_subject_area || "") === selectedPacificSubjectArea) &&
    (!pacificCourseCode || (course.pacific_course_code || "").toLowerCase().includes(pacificCourseCode.toLowerCase())) &&
    (!selectedMajor || (course.pacific_major || "").trim().toLowerCase() === selectedMajor.trim().toLowerCase())
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

  //  Only push valid course objects
  if (!course.noCourses) {
    acc[key].courses.push(course);
  }
  return acc;
}, {});



 const groupedArray = Object.values(grouped);
 const groupedWithProviders = groupedArray.map((uni) => {
  const providersSet = new Set();
  uni.courses.forEach((course) => {
    if (course.providers) providersSet.add(course.providers);
  });
  return {
    ...uni,
    providers: Array.from(providersSet),
  };
});

setResults(groupedWithProviders);

//setResults(groupedArray);       
setSearchClicked(true);
setShowResults(true);

  if (groupedArray.length === 0) {
    setNoMatchMessage(
      `No courses in ${selectedCountry || "selected country"} for the selected major.`
    );
  } else {
    setNoMatchMessage(""); // clear message if results exist
  }
  
};

 const tableHeaderStyle = {
  padding: "6px 8px",
  backgroundColor: "#E65300",
  color: "white",
  textAlign: "left",
  fontWeight: "bold",
  fontSize: "13px",
};

const tableCellStyle = {
  padding: "6px 8px",
  fontSize: "12.5px",
  borderBottom: "1px solid #ccc",
  height: "70px",  // increases row height
  overflowWrap: "break-word",  // handle long text

};
  return (

    <div
      style={{
        fontFamily: "Neuzeit Grotesk Regular, Ramaraj Regular" ,
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

  {/*  UOP Equivalent Courses */}
    <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      flex: 1,
      minHeight: "420px",
      minWidth: "400px"
    }}
  > 

  <h3 style={{ fontSize: "26px", marginTop:"0px" ,marginBottom: "10px", textAlign: "left", fontFamily: "Bely Display" }}>  Pacific Courses</h3>
  
  <label style={{marginTop: "42px",  marginBottom: "8px" , fontFamily: "Ramaraja Regular"}} >Majors:</label>
  
   <select value={selectedMajor} onChange={(e) => setSelectedMajor(e.target.value)} style={dropdownStyle} >
  <option value=""> </option>
  
  {[...new Set(uopSchools)]
    .filter((s) => s && s.trim() !== "")
    .map((s, index) => (
      <option key={`${s}-${index}`} value={s}>
        {s}
      </option>
    ))}
</select>

 <label style={{marginTop: "42px",  marginBottom: "8px" , fontFamily: "Ramaraja Regular", marginTop:"0px"}} >Course Code:</label>
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
      width: "76%",            //  Your desired width
      maxWidth: "400px",       //  Limits width on larger screens
      height: "35px",          // Your desired height
      maxHeight: "50px",
      marginBottom: "20px",
      backgroundColor: "#f9f9f9", 
      }} />
  </div>
  
{/*  UOP Equivalent Courses */}

  {/*  International Courses */}
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      flex: 1,
      minHeight: "420px",
      minWidth: "400px"
    }}
  > 
   <h3 style={{ fontSize: "26px", marginTop: "0px", marginBottom: "10px", textAlign: "left", fontFamily: "Bely Display"  }}>  International Course Equivalents</h3>

   <label style={{marginTop: "42px",  marginBottom: "8px" , fontFamily: "Ramaraja Regular"}} >Country:</label>
   

   <select
  value={selectedCountry}
  onChange={(e) => setSelectedCountry(e.target.value)}
  style={dropdownStyle}
>
  <option value=""> </option>
 {countries
  .filter((c) => c && c.trim() !== "")
  .map((c, index) => (
    <option key={`${c}-${index}`} value={c}>
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
  {institutions
    .filter((i) => i && i.trim() !== "")
    .map((i, index) => (
      <option key={`${i}-${index}`} value={i.trim()}>
        {i.trim()}
      </option>
    ))}
</select>
</div>

  </div>
  {/*  International Courses */}



  {/* 🔍 Buttons */}

<div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "0px", alignItems: "flex-start" }}>

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
 
{showResults && results.length > 0 && ( <UniversityAccordion universities={results} /> )}

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
      width:"85%",
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

