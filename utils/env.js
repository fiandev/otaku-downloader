require("dotenv").config();

module.exports = (env_key, default_value = "") => {
  let value =
    typeof process.env[env_key] !== "undefined"
      ? process.env[env_key]
      : default_value;
  return value.toLowerCase();
};
