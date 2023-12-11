import api from "./api";

export const fetchAuthToken = async () => {
    try {

      const response = await api.post('/auth', /* authentication data */);

      const authToken = response.data.token;
  
      return authToken;
    } catch (error) {
      console.error('Error fetching authentication token:', error);
      throw error; // Propagate the error for handling in the component
    }
  };