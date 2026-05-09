import redis from "../config/redis.js";


// ==============================
// Get Cached Data
// ==============================

export const getCache = async (
  key
) => {
  const data =
    await redis.get(key);

  return data
    ? JSON.parse(data)
    : null;
};


// ==============================
// Set Cache
// ==============================

export const setCache = async (
  key,
  value,
  ttl = 60
) => {
  await redis.set(
    key,
    JSON.stringify(value),
    "EX",
    ttl
  );
};


// ==============================
// Delete Cache
// ==============================

export const deleteCache =
  async (key) => {
    await redis.del(key);
  };