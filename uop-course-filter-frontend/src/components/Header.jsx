import React from "react";

const Header = () => {
  return (
    <div>
      {/* Top Black Bar with Logo */}
      <div
       style={{
    backgroundColor: "#231f20",
    height: "1in", // Black bar height
    display: "flex",
    justifyContent: "flex-start", // Align logo to the left
    alignItems: "center",
    padding: "0.1px 0.1px", // 5px top/bottom, 40px left/right spacing
  }}
      >
        <img
          src="/assets/logo.png"
          alt="University of the Pacific Logo"
          style={{ width: "2in",
             height: "1in", 
             objectFit: "contain" ,  
            display: "flex",
            justifyContent: "flex-start", // Align logo to the left
            alignItems: "center",
            padding: "2px 15px",

          }}
        />
      </div>

      {/* Banner Image */}
      <div>
        <img
          src="/assets/Pacific_Zoom_backgrounds-06.jpg"
          alt="Study Abroad Banner"
          style={{
            width: "100%",
            height: "3.5in", 
            display: "block",
            objectFit: "cover",
            alignItems: "left",
          }}
        />
      </div>
    </div>
  );
};

export default Header