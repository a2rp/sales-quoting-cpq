import { useRef } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import Modal from "../modal";
import styles from "./styles.module.css";

const ConfirmationDialog = ({ isOpen, title, itemName, description, confirmLabel = "Remove", cancelLabel = "Keep item", onConfirm, onCancel }) => {
  const cancelRef = useRef(null);
  return (
    <Modal isOpen={isOpen} title={title} description={description} onClose={onCancel} initialFocusRef={cancelRef} size="small">
      <div className={styles.content}>
        <span className={styles.icon}><FiAlertTriangle aria-hidden="true" /></span>
        {itemName && <strong className={styles.itemName}>{itemName}</strong>}
        <div className={styles.actions}>
          <button ref={cancelRef} className={styles.cancel} type="button" onClick={onCancel}>{cancelLabel}</button>
          <button className={styles.confirm} type="button" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationDialog;
