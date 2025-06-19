import { Toaster } from "react-hot-toast";
import "@/styles/globals.css";
import Layout from "@/lib/Layout";

function MyApp({ Component, pageProps }) {
  return (
      <Layout>
        <Component {...pageProps} />
        <Toaster position="top-center" />
      </Layout>
  );
}

export default MyApp;
