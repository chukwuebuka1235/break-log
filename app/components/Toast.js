import { Toaster } from "react-hot-toast";

export default function Toast() {
  return (
    <Toaster
      position="bottom-right"
      reverseOrder={false}
      toastOptions={{
        duration: 4000,
        style: {
          background: "#1e293b", 
          color: "#fff",
          fontWeight: "bold",
        },
        success: {
          iconTheme: {
            primary: "#ec3338",
            secondary: "#fff",
          },
          style: {
            background: "#ec3338",
            color: "#fff",
          },
        },
        error: {
          iconTheme: {
            primary: "#ec3338",
            secondary: "#fff",
          },
          style: {
            background: "#ec3338",
            color: "#fff",
          },
        },
      }}
    />
  );
}
