import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/login.module.css";
import { validateEmail } from "../utils/helper";
import { magic } from "../lib/magic-client";

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [userMsg, setUserMsg] = useState("");

  // NOTE  router listener
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

  const handleLoginWithEmail = async () => {
    setLoading(true);
    if (validateEmail(email)) {
      try {
        const didToken = await magic.auth.loginWithMagicLink({
          email,
        });
        console.log(didToken);
        if (didToken) {
          const response = await fetch("/api/login", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${didToken}`,
              "Content-Type": "application/json",
            },
          });

          const loggedInResponse = await response.json();
          console.log({ loggedInResponse });
          if (loggedInResponse.status) {
            router.push("/");
          } else {
            setLoading(false);
            setUserMsg("Something went wrong logging in");
          }
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    } else {
      // show user message
      setLoading(false);
      setUserMsg("Enter a valid email address");
    }
  };

  const handleOnChangeEmail = (e) => {
    setUserMsg("");
    const email = e.target.value;
    setEmail(email);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Next Netflix Login</title>
      </Head>
      <header className={styles.header}>
        <div className={styles.headerWrapper}>
          <Link href="/">
            <a className={styles.logoLink}>
              <div className={styles.logoWrapper}>
                <Image
                  src="/static/netflix.svg"
                  alt="Netflix logo"
                  width="128px"
                  height="34px"
                />
              </div>
            </a>
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.mainWrapper}>
          <h1 className={styles.signinHeader}>Sign In</h1>

          <input
            type="text"
            placeholder="Email address"
            className={styles.emailInput}
            value={email}
            onChange={handleOnChangeEmail}
          />

          <p className={styles.userMsg}>{userMsg}</p>
          <button onClick={handleLoginWithEmail} className={styles.loginBtn}>
            {loading ? "Loading..." : "Sign In"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
