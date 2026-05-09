import Product from "./product.model.js";

import elasticClient from "../../config/elasticsearch.js";

export const indexProduct = async (
  product
) => {
  await elasticClient.index({
    index: "products",

    id: product._id.toString(),

    document: {
      title: product.title,
      description:
        product.description,
      category: product.category,
      brand: product.brand,
      price: product.price,
    },
  });
};