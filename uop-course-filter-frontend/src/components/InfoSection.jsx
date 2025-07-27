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
          fontFamily: "Bely Display, Bely Display",
          fontSize: "13pt",
          lineHeight: "17pt",
          maxWidth: "1700px",
          margin: "40px auto",
        }}
      >
            
      </div>
    </div>
  );
};

export default InfoSection;