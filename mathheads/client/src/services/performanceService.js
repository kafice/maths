// client/src/services/performanceService.js
import axios from "axios";

/**
 * Service for handling performance and results tracking
 */
class PerformanceService {
  constructor() {
    this.api = axios.create({
      baseURL: "/api/results",
    });
  }

  // Add auth token to requests
  setAuthToken(token) {
    if (token) {
      this.api.defaults.headers.common["x-auth-token"] = token;
    } else {
      delete this.api.defaults.headers.common["x-auth-token"];
    }
  }

  // Submit new test result
  async submitResult(resultData) {
    try {
      const res = await this.api.post("/", resultData);
      return res.data;
    } catch (err) {
      console.error("Error submitting result:", err);
      throw err;
    }
  }

  // Get all user's test results
  async getResults() {
    try {
      const res = await this.api.get("/");
      return res.data;
    } catch (err) {
      console.error("Error getting results:", err);
      throw err;
    }
  }

  // Get user statistics
  async getUserStats() {
    try {
      const res = await this.api.get("/stats");
      return res.data;
    } catch (err) {
      console.error("Error getting user stats:", err);
      throw err;
    }
  }

  // Get a specific result by ID
  async getResultById(id) {
    try {
      const res = await this.api.get(`/${id}`);
      return res.data;
    } catch (err) {
      console.error(`Error getting result ${id}:`, err);
      throw err;
    }
  }
}

// Create an instance and export it
const performanceService = new PerformanceService();
export default performanceService;
