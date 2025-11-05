import { userHttp } from '../../http.js';

/**
 * Fetch user data with optional parameters
 * @param {string} userId - The user ID (e.g., '27768399103')
 * @param {Object} options - Optional parameters object
 * @param {boolean} [options.msisdn] - Include MSISDN data
 * @param {boolean} [options.segment] - Include segment data
 * @param {boolean} [options.play_balance] - Include play balance data
 * @param {boolean} [options.gems] - Include gems data
 * @param {boolean} [options.daily_challenges] - Include daily challenges data
 * @param {boolean} [options.weekly_chest] - Include weekly chest data
 * @param {boolean} [options.completed_chests] - Include completed chests data
 * @returns {Promise} Axios response with user data
 */
export const getUserData = async (userId, options = {}) => {
  const params = {};
  
  // Only add parameters that are explicitly set to true
  if (options.msisdn === true) params.msisdn = true;
  if (options.segment === true) params.segment = true;
  if (options.play_balance === true) params.play_balance = true;
  if (options.gems === true) params.gems = true;
  if (options.daily_challenges === true) params.daily_challenges = true;
  if (options.weekly_chest === true) params.weekly_chest = true;
  if (options.completed_chests === true) params.completed_chests = true;

  try {
    const response = await userHttp.get(`/api/user/${userId}`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

