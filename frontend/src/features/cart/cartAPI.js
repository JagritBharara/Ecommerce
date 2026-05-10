import api from "../../api/axios.js";


// ==============================
// Get Cart
// ==============================

export const getCart =
  async () => {

    const response =
      await api.get("/cart");

    return response.data.data;
  };


// ==============================
// Add To Cart
// ==============================

export const addToCart =
  async ({
    productId,
    quantity,
  }) => {

    const response =
      await api.post(
        "/cart",
        {
          productId,
          quantity,
        }
      );

    return response.data.data;
  };