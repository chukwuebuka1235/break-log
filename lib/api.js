export const getApiBaseUrl = () => {
  if (process.env.NODE_ENV === "production") {
    return "https://break-log.vercel.app";
  }
  return "";
};
