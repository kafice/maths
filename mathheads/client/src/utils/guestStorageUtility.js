// src/utils/guestStorage.js

/**
 * Save test result for guest user
 * @param {string} guestId - The guest's unique ID
 * @param {object} testResult - Result data to save
 * @returns {boolean} - Success status
 */
export const saveGuestResult = (guestId, testResult) => {
  try {
    // Get existing results or initialize empty array
    const resultsKey = `${guestId}_results`;
    const existingResults = JSON.parse(
      localStorage.getItem(resultsKey) || "[]"
    );

    // Add new result with timestamp
    const newResult = {
      ...testResult,
      id: `result_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    // Save updated results array
    localStorage.setItem(
      resultsKey,
      JSON.stringify([...existingResults, newResult])
    );

    return true;
  } catch (error) {
    console.error("Error saving guest result:", error);
    return false;
  }
};

/**
 * Get all test results for a guest user
 * @param {string} guestId - The guest's unique ID
 * @returns {array} - Array of result objects
 */
export const getGuestResults = (guestId) => {
  try {
    const resultsKey = `${guestId}_results`;
    return JSON.parse(localStorage.getItem(resultsKey) || "[]");
  } catch (error) {
    console.error("Error getting guest results:", error);
    return [];
  }
};

/**
 * Save guest test settings (for resuming tests)
 * @param {string} guestId - The guest's unique ID
 * @param {object} settings - Test settings to save
 * @returns {boolean} - Success status
 */
export const saveGuestTestSettings = (guestId, settings) => {
  try {
    const settingsKey = `${guestId}_settings`;
    localStorage.setItem(settingsKey, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error("Error saving guest settings:", error);
    return false;
  }
};

/**
 * Get guest test settings
 * @param {string} guestId - The guest's unique ID
 * @returns {object} - Saved settings or empty object
 */
export const getGuestTestSettings = (guestId) => {
  try {
    const settingsKey = `${guestId}_settings`;
    return JSON.parse(localStorage.getItem(settingsKey) || "{}");
  } catch (error) {
    console.error("Error getting guest settings:", error);
    return {};
  }
};

/**
 * Clear all guest data
 * @param {string} guestId - The guest's unique ID
 */
export const clearGuestData = (guestId) => {
  try {
    // Get all localStorage keys
    const keys = Object.keys(localStorage);

    // Remove all items with this guestId
    keys.forEach((key) => {
      if (key.includes(guestId)) {
        localStorage.removeItem(key);
      }
    });

    return true;
  } catch (error) {
    console.error("Error clearing guest data:", error);
    return false;
  }
};
