import { useEffect, useId, useRef } from "react";
import { FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const Modal = ({ isOpen, title, description, onClose, children, initialFocusRef, size = "medium" }) => {
  const dialogRef = useRef(null);
  const id = useId();

  useEffect(() => {
    if (!isOpen) return undefined;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const firstControl = initialFocusRef?.current || dialogRef.current?.querySelector("button, input, select, textarea, a[href]");
    firstControl?.focus();
    const handleKey = (event) => {
      if (event.key === "Escape") { event.preventDefault(); onClose(); }
      if (event.key === "Tab") {
        const controls = [...dialogRef.current.querySelectorAll("button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href]")];
        if (!controls.length) return;
        if (event.shiftKey && document.activeElement === controls[0]) { event.preventDefault(); controls.at(-1).focus(); }
        else if (!event.shiftKey && document.activeElement === controls.at(-1)) { event.preventDefault(); controls[0].focus(); }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [initialFocusRef, isOpen, onClose]);

  if (!isOpen) return null;
  return (
    <div className={styles.backdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className={[styles.dialog, styles[size] || styles.medium].join(" ")} ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={`${id}-title`} aria-describedby={description ? `${id}-description` : undefined}>
        <header className={styles.header}>
          <div><h2 id={`${id}-title`}>{title}</h2>{description && <p id={`${id}-description`}>{description}</p>}</div>
          <button type="button" onClick={onClose} aria-label="Close dialog"><FiX aria-hidden="true" /></button>
        </header>
        <div className={styles.body}>{children}</div>
      </section>
    </div>
  );
};

export default Modal;
