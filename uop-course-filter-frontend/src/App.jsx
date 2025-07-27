import React from "react";
import CourseFilter from "./components/CourseFilter";
import InfoSection from "./components/InfoSection";

function App() {
  return (
    <div className="App">
      {/* Intro / Banner */}
      <InfoSection />

      {/* Filter and Accordion (inside this) */}
      <CourseFilter />
    </div>
  );
}

export default App;