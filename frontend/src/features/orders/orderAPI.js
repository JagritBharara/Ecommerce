import api from "../../api/axios.js";


// ==============================
// Create Order
// ==============================

export const createOrder =
  async () => {

    const response =
      await api.post(
        "/orders"
      );

    return response.data.data;
  };


// ==============================
// Get My Orders
// ==============================

export const getMyOrders =
  async () => {

    const response =
      await api.get(
        "/orders/my-orders"
      );

    return response.data.data;
  };