import axios from "axios";

const BASE_URL = "http://localhost:5000/api"; // Make sure your server is running here

export const searchCourses = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/courses?q=${query}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
};