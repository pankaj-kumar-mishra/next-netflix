import { useRouter } from "next/router";
import Modal from "react-modal";
import cls from "classnames";
import styles from "../../styles/video-info.module.css";
import { getYoutubeVideoById } from "../../lib/youtube";
import NavBar from "../../components/nav/navbar";

// ? root element in react "root" but in next js "__next"
Modal.setAppElement("#__next");

export async function getStaticProps(context) {
  const videoId = context.params.videoId;
  const videoArray = await getYoutubeVideoById(videoId);

  return {
    props: {
      video: videoArray.length > 0 ? videoArray[0] : {},
    },
    revalidate: 10, // In seconds
  };
}

export async function getStaticPaths() {
  const listOfVideos = ["mYfJxlgR2jw", "4zH5iYM4wJo", "KCPEHsAViiQ"];
  const paths = listOfVideos.map((videoId) => ({
    params: { videoId },
  }));

  return { paths, fallback: "blocking" };
}

const VideoInfo = ({ video }) => {
  const router = useRouter();
  const { query } = router;

  const {
    title,
    publishTime,
    description,
    channelTitle,
    statistics: { viewCount } = { viewCount: 0 },
  } = video;

  return (
    <div className={styles.container}>
      <NavBar />
      <Modal
        isOpen={true}
        onRequestClose={() => router.back()}
        contentLabel="Watch the video"
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <iframe
          id="yt_player"
          title="player"
          className={styles.videoPlayer}
          type="text/html"
          width="100%"
          height="360"
          src={`https://www.youtube.com/embed/${query.videoId}?autoplay=0&origin=http://example.com&controls=1&rel=1`}
          frameBorder="0"
        />

        <div className={styles.modalBody}>
          <div className={styles.modalBodyContent}>
            <div className={styles.col1}>
              <p className={styles.publishTime}>{publishTime}</p>
              <p className={styles.title}>{title}</p>
              <p className={styles.description}>{description}</p>
            </div>
            <div className={styles.col2}>
              <p className={cls(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>Cast: </span>
                <span className={styles.channelTitle}>{channelTitle}</span>
              </p>
              <p className={cls(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>View Count: </span>
                <span className={styles.channelTitle}>{viewCount}</span>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default VideoInfo;
