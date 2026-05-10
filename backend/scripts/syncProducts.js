import "dotenv/config";

import elasticClient from "../src/config/elasticsearch.js";

import Product from "../src/modules/product/product.model.js";

import connectDB from "../src/config/db.js";


// ==============================
// Sync Products
// ==============================

const syncProducts = async () => {

  try {

    // Connect MongoDB
    await connectDB();

    console.log(
      "MongoDB Connected"
    );

    // Fetch products
    const products =
      await Product.find();

    console.log(
      `Found ${products.length} products`
    );

    // Clear old index (optional)
    const indexExists =
      await elasticClient.indices.exists({
        index: "products",
      });

    if (indexExists) {

      await elasticClient.indices.delete({
        index: "products",
      });

      console.log(
        "Old Elasticsearch index deleted"
      );
    }

    // Create fresh index
    await elasticClient.indices.create({
      index: "products",
    });

    console.log(
      "New Elasticsearch index created"
    );

    // Prepare bulk operations
    const operations =
      products.flatMap((product) => [
        {
          index: {
            _index: "products",
            _id: product._id.toString(),
          },
        },

        {
          title: product.title,
          description:
            product.description,
          category:
            product.category,
          brand: product.brand,
          price: product.price,
          stock: product.stock,
          rating: product.rating,
        },
      ]);

    // Bulk insert
    const result =
      await elasticClient.bulk({
        refresh: true,
        operations,
      });

    if (result.errors) {

      console.error(
        "Some documents failed to index"
      );

    } else {

      console.log(
        "All products indexed successfully"
      );
    }

    console.log(
      "Elasticsearch sync completed"
    );

    process.exit(0);

  } catch (error) {

    console.error(
      "Sync Error:",
      error
    );

    process.exit(1);
  }
};

syncProducts();