import { Toaster } from "react-hot-toast";
import "@/styles/globals.css"; // eller din egen stilimport

function MyApp({ Component, pageProps }) {
  return (
      <>
        <Component {...pageProps} />
        <Toaster position="top-center" />
      </>
  );
}

export default MyApp;
