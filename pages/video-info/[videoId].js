import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Modal from "react-modal";
import cls from "classnames";
import styles from "../../styles/video-info.module.css";
import { getYoutubeVideoById } from "../../lib/youtube";
import NavBar from "../../components/nav/navbar";

import Like from "../../components/icons/like-icon";
import DisLike from "../../components/icons/dislike-icon";

// NOTE root element in react "root" but in next js "__next"
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
  const videoId = router.query?.videoId;

  const [like, setLike] = useState(false);
  const [dislike, setDislike] = useState(false);

  const {
    title,
    publishTime,
    description,
    channelTitle,
    statistics: { viewCount } = { viewCount: 0 },
  } = video;

  useEffect(() => {
    const handleGetStats = async () => {
      const response = await fetch(`/api/stats?videoId=${videoId}`, {
        method: "GET",
      });
      const res = await response.json();
      if (res.data.length > 0) {
        const favourited = res.data[0].favourited;
        if (favourited === 1) {
          setLike(true);
        } else if (favourited === 0) {
          setDislike(true);
        }
      }
    };

    handleGetStats();
  }, [videoId]);

  const updateRating = async (favourited) => {
    const response = await fetch("/api/stats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        videoId,
        favourited,
      }),
    });
    return response;
  };

  const handleToggleLike = async () => {
    setLike(true);
    setDislike(false);
    const res = await updateRating(1);
    console.log(res);
  };

  const handleToggleDislike = async () => {
    setDislike(true);
    setLike(false);
    const res = await updateRating(0);
    console.log(res);
  };

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
          src={`https://www.youtube.com/embed/${videoId}?autoplay=0&origin=http://example.com&controls=1&rel=1`}
          frameBorder="0"
        />

        <div className={styles.likeDislikeBtnWrapper}>
          <button onClick={handleToggleLike}>
            <div className={cls(styles.btnWrapper, styles.likeBtnWrapper)}>
              <Like selected={like} />
            </div>
          </button>
          <button onClick={handleToggleDislike}>
            <div className={styles.btnWrapper}>
              <DisLike selected={dislike} />
            </div>
          </button>
        </div>
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
