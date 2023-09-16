require("dotenv").config();

module.exports = (env_key, default_value = "") => {
  if (!env_key) return process.env;
  let value =
    typeof process.env[env_key] !== "undefined"
      ? process.env[env_key]
      : default_value;
  return value;
};
