import Head from "next/head";
import Banner from "../components/banner/banner";
import SectionCards from "../components/card/section-cards";
import NavBar from "../components/nav/navbar";
import {
  getPopularVideos,
  getVideos,
  getWatchItAgainVideos,
} from "../lib/youtube";
// import useRedirectUser from "../hooks/useRedirectUser";
import redirectUser from "../hooks/useRedirectUser";
import styles from "../styles/Home.module.css";

export async function getServerSideProps(context) {
  // const token = context.req.cookies?.token;
  // const userId = verifyToken(token);
  // NOTE  below showing warning for "use" keyword, because we are using custom hook in getServerSideProps;
  // const { userId, token } = useRedirectUser(context);
  const { userId, token } = redirectUser(context);

  if (!userId) {
    return {
      props: {},
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // const watchItAgainVideos = [];
  // const disneyVideos = [];
  const productivityVideos = [];
  const travelVideos = [];
  const popularVideos = [];

  const watchItAgainVideos = await getWatchItAgainVideos(userId, token);
  const disneyVideos = await getVideos("disney trailer");
  // const productivityVideos = await getVideos("productivity");
  // const travelVideos = await getVideos("travel");
  // const popularVideos = await getPopularVideos();

  return {
    props: {
      watchItAgainVideos,
      disneyVideos,
      productivityVideos,
      travelVideos,
      popularVideos,
    },
  };
}

export default function Home({
  watchItAgainVideos,
  disneyVideos,
  productivityVideos,
  travelVideos,
  popularVideos,
}) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Next Netflix</title>
        <meta name="description" content="Discover videos" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <NavBar />
        <Banner
          videoId="4zH5iYM4wJo"
          title="Clifford the red dog"
          subTitle="a very cute dog"
          imgUrl="/static/clifford.webp"
        />
        <div className={styles.sectionWrapper}>
          <SectionCards title="Disney" size="large" videos={disneyVideos} />
          <SectionCards
            title="Watch it again"
            videos={watchItAgainVideos}
            size="small"
          />
          <SectionCards title="Travel" size="small" videos={travelVideos} />
          <SectionCards
            title="Productivity"
            size="medium"
            videos={productivityVideos}
          />
          <SectionCards title="Popular" size="small" videos={popularVideos} />
        </div>
      </div>
    </div>
  );
}
