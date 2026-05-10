import api from "../../api/axios.js";


// ==============================
// Get All Products
// ==============================

export const getProducts =
  async () => {

    const response =
      await api.get("/products");

    return response.data.data;
  };


// ==============================
// Search Products
// ==============================

export const searchProducts =
  async (query) => {

    const response =
      await api.get(
        `/products/search?q=${query}`
      );

    return response.data.data;
  };