import Card from "./card";
import styles from "./section-cards.module.css";

const SectionCards = ({ title, size = "medium", videos = [] }) => {
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.cardWrapper}>
        {videos.map((item, index) => (
          <Card key={index} index={index} size={size} imgUrl={item.imgUrl} />
        ))}
      </div>
    </section>
  );
};

export default SectionCards;
