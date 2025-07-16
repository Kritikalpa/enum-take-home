import React, { useEffect, useRef } from "react";
import styles from "./Modal.module.scss";

interface Props {
  onClose: () => void;
}

const Modal: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const focusableSelectors = [
      "button",
      "a[href]",
      "input",
      "select",
      "textarea",
      "iframe",
      "[tabindex]:not([tabindex='-1'])",
    ];
    const modal = modalRef.current;
    const focusable = modal?.querySelectorAll<HTMLElement>(
      focusableSelectors.join(",")
    );
    const first = focusable?.[0];
    first?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();

      if (e.key === "Tab" && focusable && focusable.length > 0) {
        
      const focusArray = Array.from(focusable);
        const currentIndex = focusArray.indexOf(
          document.activeElement as HTMLElement
        );
        if (e.shiftKey) {
          if (currentIndex === 0) {
            e.preventDefault();
            focusArray[focusArray.length - 1].focus();
          }
        } else {
          if (currentIndex === focusArray.length - 1) {
            e.preventDefault();
            focusArray[0].focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, modalRef.current]);

  return (
    <div
      className={styles.modal}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={styles.modalContent}
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
