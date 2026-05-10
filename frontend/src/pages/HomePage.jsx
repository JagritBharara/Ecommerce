import {
  useQuery,
} from "@tanstack/react-query";

import {
  useState,
} from "react";

import ProductCard from
  "../components/ProductCard.jsx";

import {
  getProducts,
  searchProducts,
} from "../features/products/productAPI.js";

import useDebounce from
  "../hooks/useDebounce.js";


const HomePage = () => {

  const [search, setSearch] =
    useState("");

  // ==============================
  // Debounced Search
  // ==============================

  const debouncedSearch =
    useDebounce(search, 500);

  // ==============================
  // Products Query
  // ==============================

  const {
    data,
    isLoading,
    error,
  } = useQuery({

    queryKey: [
      "products",
      debouncedSearch,
    ],

    queryFn: () =>

      debouncedSearch.length >= 2
        ? searchProducts(
            debouncedSearch
          )
        : getProducts(),
  });

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
        Something went wrong
      </div>
    );
  }

  return (

    <div className="p-6">

      {/* =========================
          Search Bar
      ========================== */}

      <input
        type="text"

        placeholder="
          Search products...
        "

        value={search}

        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }

        className="
          w-full
          border
          p-3
          rounded-lg
          mb-6
        "
      />

      {/* =========================
          Product Grid
      ========================== */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-4
          gap-6
        "
      >

        {data?.products?.map(
          (product) => (

            <ProductCard
              key={
                product.id ||
                product._id
              }

              product={product}
            />
          )
        )}

      </div>

    </div>
  );
};

export default HomePage;