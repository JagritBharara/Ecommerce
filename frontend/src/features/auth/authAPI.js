import api from "../../api/axios.js";


// ==============================
// Register User
// ==============================

export const registerUser =
  async (data) => {

    const response =
      await api.post(
        "/auth/register",
        data
      );

    return response.data;
  };


// ==============================
// Login User
// ==============================

export const loginUser =
  async (data) => {

    const response =
      await api.post(
        "/auth/login",
        data
      );

    return response.data;
  };


// ==============================
// Logout User
// ==============================

export const logoutUser =
  async () => {

    const response =
      await api.post(
        "/auth/logout"
      );

    return response.data;
  };

  export const getCurrentUser =
  async () => {

    const response =
      await api.get(
        "/auth/me"
      );

    return response.data.data;
  };