import Product from "./product.model.js";

import asyncHandler from "../../utils/asyncHandler.js";

import elasticClient from "../../config/elasticsearch.js";

import ApiResponse from "../../utils/apiResponse.js";
import redis from "../../config/redis.js";
import { indexProduct } from "./product.service.js";
import {
  getCache,
  setCache,
} from "../../utils/cache.js";

// ==============================
// Create Product
// ==============================

export const createProduct =
  asyncHandler(async (req, res) => {

    const product =
      await Product.create(req.body);

    // Index product in Elasticsearch
    await indexProduct(product);
    await redis.flushall();
    return res.status(201).json(
      new ApiResponse(
        201,
        "Product created successfully",
        product
      )
    );
  });


// ==============================
// Search Products
// ==============================
export const searchProducts =
  asyncHandler(async (req, res) => {

    const {
      q,
      category,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    // ==============================
    // Redis Cache Key
    // ==============================

    const cacheKey =
      `products:${q || "all"}:${category || "all"}:${sort || "default"}:${page}:${limit}`;

    // ==============================
    // Check Cache
    // ==============================

    const cachedData =
      await getCache(cacheKey);

    if (cachedData) {
      return res.status(200).json(
        new ApiResponse(
          200,
          "Products fetched from cache",
          cachedData
        )
      );
    }

    // ==============================
    // Pagination
    // ==============================

    const from =
      (Number(page) - 1) *
      Number(limit);

    // ==============================
    // Dynamic Elasticsearch Queries
    // ==============================

    const mustQueries = [];

    // Full-text fuzzy search
    if (q) {
      mustQueries.push({
        multi_match: {
          query: q,

          fields: [
            "title^3",
            "description",
            "category",
            "brand",
          ],

          fuzziness: "AUTO",
        },
      });
    }

    // Category filter
    if (category) {
      mustQueries.push({
        match: {
          category,
        },
      });
    }

    // ==============================
    // Sorting
    // ==============================

    let sortOption = [];

    if (sort === "price_asc") {
      sortOption = [
        {
          price: "asc",
        },
      ];
    }

    if (sort === "price_desc") {
      sortOption = [
        {
          price: "desc",
        },
      ];
    }

    // ==============================
    // Elasticsearch Search
    // ==============================

    const result =
      await elasticClient.search({

        index: "products",

        from,

        size: Number(limit),

        sort: sortOption,

        query: {
          bool: {
            must:
              mustQueries.length > 0
                ? mustQueries
                : [{ match_all: {} }],
          },
        },
      });

    // ==============================
    // Format Results
    // ==============================

    const products =
      result.hits.hits.map((hit) => ({
        id: hit._id,
        score: hit._score,
        ...hit._source,
      }));

    // ==============================
    // Response Object
    // ==============================

    const responseData = {
      total:
        result.hits.total.value,

      currentPage:
        Number(page),

      totalResults:
        products.length,

      products,
    };

    // ==============================
    // Store In Redis Cache
    // ==============================

    await setCache(
      cacheKey,
      responseData,
      60
    );

    // ==============================
    // Final Response
    // ==============================

    return res.status(200).json(
      new ApiResponse(
        200,
        "Products fetched successfully",
        responseData
      )
    );
  });


  export const getProducts =
  asyncHandler(async (req, res) => {

    const {
      page = 1,
      limit = 10,
      category,
      sort,
    } = req.query;

    // ==============================
    // Cache Key
    // ==============================

    const cacheKey =
      `all-products:${page}:${limit}:${category || "all"}:${sort || "default"}`;

    // ==============================
    // Check Redis Cache
    // ==============================

    const cachedData =
      await getCache(cacheKey);

    if (cachedData) {
      return res.status(200).json(
        new ApiResponse(
          200,
          "Products fetched from cache",
          cachedData
        )
      );
    }

    // ==============================
    // MongoDB Query
    // ==============================

    const query = {};

    if (category) {
      query.category = category;
    }

    // ==============================
    // Sorting
    // ==============================

    let sortOption = {};

    if (sort === "price_asc") {
      sortOption.price = 1;
    }

    if (sort === "price_desc") {
      sortOption.price = -1;
    }

    // ==============================
    // Pagination
    // ==============================

    const skip =
      (Number(page) - 1) *
      Number(limit);

    // ==============================
    // Fetch Products
    // ==============================

    const products =
      await Product.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit));

    const total =
      await Product.countDocuments(
        query
      );

    // ==============================
    // Response Object
    // ==============================

    const responseData = {
      total,

      currentPage:
        Number(page),

      totalPages: Math.ceil(
        total / limit
      ),

      totalResults:
        products.length,

      products,
    };

    // ==============================
    // Save To Cache
    // ==============================

    await setCache(
      cacheKey,
      responseData,
      60
    );

    // ==============================
    // Final Response
    // ==============================

    return res.status(200).json(
      new ApiResponse(
        200,
        "Products fetched successfully",
        responseData
      )
    );
  });


  export const getProductById =
  asyncHandler(async (req, res) => {

    const { id } = req.params;

    // ==============================
    // Cache Key
    // ==============================

    const cacheKey =
      `product:${id}`;

    // ==============================
    // Check Cache
    // ==============================

    const cachedProduct =
      await getCache(cacheKey);

    if (cachedProduct) {
      return res.status(200).json(
        new ApiResponse(
          200,
          "Product fetched from cache",
          cachedProduct
        )
      );
    }

    // ==============================
    // Fetch Product
    // ==============================

    const product =
      await Product.findById(id);

    if (!product) {
      throw new ApiError(
        404,
        "Product not found"
      );
    }

    // ==============================
    // Store Cache
    // ==============================

    await setCache(
      cacheKey,
      product,
      60
    );

    // ==============================
    // Final Response
    // ==============================

    return res.status(200).json(
      new ApiResponse(
        200,
        "Product fetched successfully",
        product
      )
    );
  });