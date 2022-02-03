import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { magic } from "../lib/magic-client";
import Loader from "../components/loader/loader";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleComplete = () => {
      setLoading(false);
    };
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  const handleAuthRoute = async () => {
    setLoading(true);
    const isLoggedIn = await magic.user.isLoggedIn();
    if (isLoggedIn) {
      router.replace("/");
    } else {
      router.replace("/login");
    }
  };

  useEffect(() => {
    handleAuthRoute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return loading ? <Loader /> : <Component {...pageProps} />;
}

export default MyApp;
