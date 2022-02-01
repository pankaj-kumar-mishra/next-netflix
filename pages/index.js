import Head from "next/head";
import Banner from "../components/banner/banner";
import SectionCards from "../components/card/section-cards";
import NavBar from "../components/nav/navbar";
import styles from "../styles/Home.module.css";

const disneyVideos = [
  { imgUrl: "/static/clifford.webp" },
  { imgUrl: "/static/clifford.webp" },
  { imgUrl: "/static/clifford.webp" },
  { imgUrl: "/static/clifford.webp" },
  { imgUrl: "/static/clifford.webp" },
  { imgUrl: "/static/clifford.webp" },
];

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Next Netflix</title>
        <meta name="description" content="Discover videos" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar username="pankaj@mern.com" />
      <Banner
        title="Clifford the red dog"
        subTitle="a very cute dog"
        imgUrl="/static/clifford.webp"
      />
      <div className={styles.sectionWrapper}>
        <SectionCards title="Disney" size="large" videos={disneyVideos} />
      </div>
    </div>
  );
}
