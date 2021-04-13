import React, { FunctionComponent } from 'react';
import styles from './TV.module.scss';

const NewTV: FunctionComponent = ({ children }) => (
  <div className={styles.container}>
    <div className={styles.content}>
      <div className={styles.title}>Hello</div>
      <div className={styles.separator} />

      {children}
    </div>

    <div className={styles.bottom}>
      <div className={`${styles.bottomItem} ${styles.bar}`} />
      <div className={`${styles.bottomItem} ${styles.circle}`} />
    </div>
  </div>
);

export default NewTV;
