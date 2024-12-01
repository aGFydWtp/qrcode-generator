import { component$ } from "@builder.io/qwik";

import styles from './header.module.css';

export default component$(() => {
  return (
    <header class={styles.header}>
      QR Code <span class={styles.highlight}>Generator</span>
    </header>
  );
});
