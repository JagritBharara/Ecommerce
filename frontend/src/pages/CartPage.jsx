import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  useNavigate,
} from "react-router-dom";

import {
  getCart,
} from "../features/cart/cartAPI.js";

import {
  createOrder,
} from "../features/orders/orderAPI.js";


const CartPage = () => {

  const queryClient =
    useQueryClient();

  const navigate =
    useNavigate();

  // ==============================
  // Get Cart Query
  // ==============================

  const {
    data,
    isLoading,
    error,
  } = useQuery({

    queryKey: ["cart"],

    queryFn: getCart,
  });

  // ==============================
  // Checkout Mutation
  // ==============================

  const checkoutMutation =
    useMutation({

      mutationFn:
        createOrder,

      onSuccess: () => {

        // Refresh cart
        queryClient.invalidateQueries({
          queryKey: ["cart"],
        });

        // Refresh orders
        queryClient.invalidateQueries({
          queryKey: ["orders"],
        });

        alert(
          "Order placed successfully"
        );

        navigate("/orders");
      },

      onError: (error) => {

        console.error(error);

        alert(
          error.response?.data
            ?.message ||
          "Checkout failed"
        );
      },
    });

  // ==============================
  // Handle Checkout
  // ==============================

  const handleCheckout =
    () => {

      checkoutMutation.mutate();
    };

  // ==============================
  // Loading State
  // ==============================

  if (isLoading) {

    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  // ==============================
  // Error State
  // ==============================

  if (error) {

    return (
      <div className="p-6">
        Failed to load cart
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
        Cart
      </h1>

      {/* =========================
          Empty Cart
      ========================== */}

      {data?.items?.length === 0 && (

        <div
          className="
            text-gray-500
          "
        >
          Your cart is empty
        </div>
      )}

      {/* =========================
          Cart Items
      ========================== */}

      <div className="space-y-4">

        {data?.items?.map(
          (item) => (

            <div
              key={
                item.product._id
              }

              className="
                border
                p-4
                rounded-lg
                flex
                justify-between
                items-center
              "
            >

              <div>

                <h2
                  className="
                    font-semibold
                  "
                >
                  {
                    item.product
                      .title
                  }
                </h2>

                <p
                  className="
                    text-sm
                    text-gray-600
                  "
                >
                  Quantity:
                  {" "}
                  {
                    item.quantity
                  }
                </p>

              </div>

              <p
                className="
                  font-bold
                "
              >
                $
                {
                  item.product
                    .price *
                  item.quantity
                }
              </p>

            </div>
          )
        )}

      </div>

      {/* =========================
          Total
      ========================== */}

      {data?.items?.length > 0 && (

        <div
          className="
            mt-8
            border-t
            pt-6
          "
        >

          <div
            className="
              text-2xl
              font-bold
              mb-4
            "
          >
            Total:
            {" "}
            $
            {
              data?.totalPrice || 0
            }
          </div>

          {/* =====================
              Checkout Button
          ====================== */}

          <button
            onClick={
              handleCheckout
            }

            disabled={
              checkoutMutation.isPending
            }

            className="
              bg-black
              text-white
              px-6
              py-3
              rounded-lg
              disabled:opacity-50
            "
          >
            {
              checkoutMutation.isPending
                ? "Processing..."
                : "Checkout"
            }
          </button>

        </div>
      )}

    </div>
  );
};

export default CartPage;