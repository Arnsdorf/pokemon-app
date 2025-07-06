import { Toaster } from "react-hot-toast";
import "@/styles/globals.css";
import Layout from "@/lib/Layout";
import { Inter } from "next/font/google";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

function MyApp({ Component, pageProps }) {
    return (
        <div className={`${inter.className} min-h-screen`}>
            <Layout>
                <Component {...pageProps} />
                <Toaster position="top-center" />
            </Layout>
        </div>
    );
}

export default MyApp;
