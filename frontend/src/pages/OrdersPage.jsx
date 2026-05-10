import {
  useQuery,
} from "@tanstack/react-query";

import {
  getMyOrders,
} from "../features/orders/orderAPI.js";


const OrdersPage = () => {

  const {
    data,
    isLoading,
    error,
  } = useQuery({

    queryKey: ["orders"],

    queryFn:
      getMyOrders,
  });

  // ==============================
  // Loading
  // ==============================

  if (isLoading) {

    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  // ==============================
  // Error
  // ==============================

  if (error) {

    return (
      <div className="p-6">
        Failed to load orders
      </div>
    );
  }

  return (

    <div className="p-6">

      <h1
        className="
          text-3xl
          font-bold
          mb-6
        "
      >
        My Orders
      </h1>

      <div className="space-y-6">

        {data?.map((order) => (

          <div
            key={order._id}

            className="
              border
              rounded-lg
              p-6
            "
          >

            <div
              className="
                flex
                justify-between
                mb-4
              "
            >

              <h2
                className="
                  font-bold
                "
              >
                Order #
                {
                  order._id.slice(-6)
                }
              </h2>

              <span
                className="
                  capitalize
                  text-sm
                "
              >
                {order.status}
              </span>

            </div>

            {/* =====================
                Order Items
            ====================== */}

            <div className="space-y-2">

              {order.items.map(
                (item) => (

                  <div
                    key={
                      item.product._id
                    }

                    className="
                      flex
                      justify-between
                    "
                  >

                    <span>
                      {
                        item.product
                          .title
                      }
                    </span>

                    <span>
                      x
                      {
                        item.quantity
                      }
                    </span>

                  </div>
                )
              )}

            </div>

            {/* =====================
                Total
            ====================== */}

            <div
              className="
                mt-4
                font-bold
              "
            >
              Total:
              {" "}
              $
              {
                order.totalPrice
              }
            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default OrdersPage;