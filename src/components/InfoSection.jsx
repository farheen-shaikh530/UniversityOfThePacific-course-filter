import React from "react";

const InfoSection = () => {
  return (
    <div style={{ width: "100%" }}>
     
      <div style={{ backgroundColor: "#231f20", padding: "2px 0" , height: "90px"}}>
        <img
          src="/assets/logo.png"
          alt="University of the Pacific Logo"
          style={{ width: "2in", marginTop: "5px", marginLeft: "10px" }}
        />
      </div>

      
      <img
        src="/assets/Pacific_zoombackground-15.jpg"
        alt="Pacific Campus Banner"
  style={{
    width: "100%",
    height: "200px",         
    objectFit: "cover",    
    display: "block",
  }}

      />

      <h1
    style={{
      position: "absolute",
      top: "150px",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "white",
    fontSize: "80px",  
    padding: "12px 24px",
    borderRadius: "12px",
   
    width: "130%",
    
    }}
  >
    Study Abroad Course Search
  </h1>

  <div
  style={{
    maxWidth: "1100px",      
    margin: "60px auto",      
    padding: "0 20px",        
    fontFamily: "Open Sans",
    fontSize: "13pt",
    lineHeight: "17pt",
    textAlign: "left",
     marginTop: "50px",
  }}
>
 
  <p style={{ marginBottom: "40px", marginTop: "100px" }}>
  This tool is designed to help you identify pre-approved course equivalents from our foreign partner institutions. 
  If you find matching courses, please list them on your{" "}
  <a
    href="/Course Approval Request form.pdf"
    target="_blank"
    rel="noopener noreferrer"
    download
    style={{ color: "#FF671D", textDecoration: "underline" }}
  > Course Approval Request (CAR) form </a>.</p>

<p style={{ marginTop: "0px" }}>
  If you are unable to locate courses within your discipline, you may still proceed with submitting your CAR form as usual.  
  For questions, contact us at{" "}
  <a  href="mailto:studyabroad@pacific.edu"  style={{ color: "#FF671D", textDecoration: "underline" }} > studyabroad@pacific.edu</a>

</p>

</div>

    </div>
  );
};

export default InfoSection;