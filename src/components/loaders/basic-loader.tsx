import React from "react";
import styles from "@/styles/Header.module.css";

export const BasicLoader = () => {
  return (
    <div className={styles.loader}>
      <span className={styles.bar}></span>
      <span className={styles.bar}></span>
      <span className={styles.bar}></span>
    </div>
  );
};
