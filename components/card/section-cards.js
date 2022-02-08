import Link from "next/link";
import cls from "classnames";
import Card from "./card";
import styles from "./section-cards.module.css";

const SectionCards = ({
  title,
  size = "medium",
  videos = [],
  shouldWrap = false,
  shouldScale = true,
}) => {
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={cls(styles.cardWrapper, shouldWrap && styles.wrap)}>
        {videos.map((item, index) => (
          <Link key={index} href={`/video-info/${item.id}`}>
            <a>
              <Card
                index={index}
                size={size}
                imgUrl={item.imgUrl}
                shouldScale={shouldScale}
              />
            </a>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default SectionCards;
