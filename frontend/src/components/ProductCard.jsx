import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  addToCart,
} from "../features/cart/cartAPI.js";


const ProductCard = ({
  product,
}) => {

  const queryClient =
    useQueryClient();

  // ==============================
  // Add To Cart Mutation
  // ==============================

  const mutation =
    useMutation({

      mutationFn:
        addToCart,

      onSuccess: () => {

        queryClient.invalidateQueries({
          queryKey: ["cart"],
        });

        alert(
          "Added to cart"
        );
      },

      onError: (error) => {

        console.error(error);

        alert(
          error.response?.data
            ?.message ||
          "Failed to add to cart"
        );
      },
    });

  // ==============================
  // Handle Add To Cart
  // ==============================

  const handleAddToCart =
    () => {

      mutation.mutate({

        productId:
          product.id ||
          product._id,

        quantity: 1,
      });
    };

  return (

    <div
      className="
        border
        rounded-lg
        p-4
        shadow-sm
      "
    >

      <img
        src={
          product.images?.[0]
        }

        alt={product.title}

        className="
          h-48
          w-full
          object-cover
          rounded
        "
      />

      <h2
        className="
          text-lg
          font-semibold
          mt-3
        "
      >
        {product.title}
      </h2>

      <p
        className="
          text-sm
          text-gray-600
          mt-1
        "
      >
        {product.category}
      </p>

      <p
        className="
          mt-2
          font-bold
        "
      >
        ${product.price}
      </p>

      <button
        onClick={
          handleAddToCart
        }

        disabled={
          mutation.isPending
        }

        className="
          mt-4
          w-full
          bg-black
          text-white
          p-2
          rounded
          disabled:opacity-50
        "
      >
        {
          mutation.isPending
            ? "Adding..."
            : "Add To Cart"
        }
      </button>

    </div>
  );
};

export default ProductCard;