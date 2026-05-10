import {
  useForm,
} from "react-hook-form";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createProduct,
  getAllProducts,
} from "../../features/products/adminProductAPI.js";


const AdminProductsPage =
  () => {

    const {
      register,
      handleSubmit,
      reset,
    } = useForm();

    const queryClient =
      useQueryClient();

    // ==========================
    // Get Products
    // ==========================

    const {
      data,
      isLoading,
    } = useQuery({

      queryKey: [
        "admin-products",
      ],

      queryFn:
        getAllProducts,
    });

    // ==========================
    // Create Product Mutation
    // ==========================

    const mutation =
      useMutation({

        mutationFn:
          createProduct,

        onSuccess: () => {

          queryClient.invalidateQueries({
            queryKey: [
              "admin-products",
            ],
          });

          reset();

          alert(
            "Product created"
          );
        },
      });

    // ==========================
    // Submit Handler
    // ==========================

    const onSubmit =
      (formData) => {

        mutation.mutate({

          ...formData,

          price:
            Number(
              formData.price
            ),

          stock:
            Number(
              formData.stock
            ),

          images: [
            formData.image,
          ],
        });
      };

    if (isLoading) {

      return (
        <div className="p-6">
          Loading...
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
          Manage Products
        </h1>

        {/* ======================
            Create Product Form
        ======================= */}

        <form
          onSubmit={
            handleSubmit(onSubmit)
          }

          className="
            border
            p-6
            rounded-lg
            space-y-4
            mb-10
          "
        >

          <input
            placeholder="Title"

            {...register("title")}

            className="
              w-full
              border
              p-3
              rounded
            "
          />

          <textarea
            placeholder="Description"

            {...register(
              "description"
            )}

            className="
              w-full
              border
              p-3
              rounded
            "
          />

          <input
            placeholder="Category"

            {...register(
              "category"
            )}

            className="
              w-full
              border
              p-3
              rounded
            "
          />

          <input
            placeholder="Brand"

            {...register("brand")}

            className="
              w-full
              border
              p-3
              rounded
            "
          />

          <input
            type="number"

            placeholder="Price"

            {...register("price")}

            className="
              w-full
              border
              p-3
              rounded
            "
          />

          <input
            type="number"

            placeholder="Stock"

            {...register("stock")}

            className="
              w-full
              border
              p-3
              rounded
            "
          />

          <input
            placeholder="Image URL"

            {...register("image")}

            className="
              w-full
              border
              p-3
              rounded
            "
          />

          <button
            type="submit"

            className="
              bg-black
              text-white
              px-6
              py-3
              rounded
            "
          >
            Create Product
          </button>

        </form>

        {/* ======================
            Products List
        ======================= */}

        <div className="space-y-4">

          {data?.products?.map(
            (product) => (

              <div
                key={
                  product._id ||
                  product.id
                }

                className="
                  border
                  rounded-lg
                  p-4
                  flex
                  justify-between
                "
              >

                <div>

                  <h2
                    className="
                      font-semibold
                    "
                  >
                    {
                      product.title
                    }
                  </h2>

                  <p>
                    $
                    {
                      product.price
                    }
                  </p>

                </div>

                <div>
                  Stock:
                  {" "}
                  {
                    product.stock
                  }
                </div>

              </div>
            )
          )}

        </div>

      </div>
    );
  };

export default
  AdminProductsPage;