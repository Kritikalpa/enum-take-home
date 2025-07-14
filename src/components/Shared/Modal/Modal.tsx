import React from "react";
import styles from "./Modal.module.scss";

interface Props {
  onClose: () => void;
}

const Modal: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  onClose,
}) => (
  <div className={styles.modal} onClick={onClose}>
    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

export default Modal;
