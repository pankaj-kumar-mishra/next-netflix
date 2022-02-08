import Head from "next/head";
import SectionCards from "../../components/card/section-cards";
import NavBar from "../../components/nav/navbar";
import redirectUser from "../../hooks/useRedirectUser";
import { getMyList } from "../../lib/youtube";
import styles from "../../styles/my-list.module.css";

export async function getServerSideProps(context) {
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

  const videos = await getMyList(userId, token);

  return {
    props: {
      myListVideos: videos,
    },
  };
}

const MyList = ({ myListVideos }) => {
  return (
    <div>
      <Head>
        <title>My list</title>
      </Head>
      <main className={styles.main}>
        <NavBar />
        <div className={styles.sectionWrapper}>
          <SectionCards
            title="My List"
            videos={myListVideos}
            size="small"
            shouldWrap
            shouldScale={false}
          />
        </div>
      </main>
    </div>
  );
};

export default MyList;
