import styles from "./StudyPage.module.css";
import Button from "../components/Button";
function StudyPage() {
  return (
    <div className={styles.container}>
      <div className={styles.question}>Lorem ipsum dolor </div>
      <div className={styles.answer}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum explicabo
        nobis
      </div>
      <div className={styles.buttons}>
        <Button text="Again" />
        <Button text="Hard" />
        <Button text="Good" />
        <Button text="Easy" />
      </div>
    </div>
  );
}

export default StudyPage;
