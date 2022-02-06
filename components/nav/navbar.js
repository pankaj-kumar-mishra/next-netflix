import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { magic } from "../../lib/magic-client";
import styles from "./navbar.module.css";

const NavBar = () => {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const handleGetEmail = async () => {
    try {
      const userData = await magic.user.getMetadata();
      // console.log({ userData });
      // console.log(await magic.user.generateIdToken());
      if (userData.email) {
        setUserEmail(userData.email);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetEmail();
  }, []);

  const handleLogout = async () => {
    try {
      await magic.user.logout();
    } catch (error) {
      console.log(error);
    } finally {
      router.replace("/login");
    }
  };

  const handleOnClickMyList = (e) => {
    e.preventDefault();
    console.log("MyList Link clicked");
    router.push("/browse/mylist");
  };

  const handleShowDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
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

        <ul className={styles.navItems}>
          <Link href="/">
            <a className={styles.navItem}>Home</a>
          </Link>
          <li className={styles.navItem2} onClick={handleOnClickMyList}>
            My List
          </li>
        </ul>
        <nav className={styles.navContainer}>
          <div>
            <button className={styles.usernameBtn} onClick={handleShowDropdown}>
              <p className={styles.username}>{userEmail}</p>
              {/** Expand more icon */}
              <Image
                src={"/static/expand_more.svg"}
                alt="Expand dropdown"
                width="24px"
                height="24px"
              />
            </button>

            {showDropdown && (
              <div className={styles.navDropdown}>
                <a className={styles.linkName} onClick={handleLogout}>
                  Sign out
                </a>
                <div className={styles.lineWrapper}></div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default NavBar;
