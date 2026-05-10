import api from "../../api/axios.js";


// ==============================
// Create Product
// ==============================

export const createProduct =
  async (data) => {

    const response =
      await api.post(
        "/products",
        data
      );

    return response.data.data;
  };


// ==============================
// Get All Products
// ==============================

export const getAllProducts =
  async () => {

    const response =
      await api.get(
        "/products"
      );

    return response.data.data;
  };