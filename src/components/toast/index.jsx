import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const icons = { success: FiCheckCircle, error: FiAlertCircle, info: FiInfo };

const Toast = ({ toast, onClose }) => {
  if (!toast) return null;
  const Icon = icons[toast.type] || icons.info;
  const role = toast.type === "error" ? "alert" : "status";
  return (
    <div className={[styles.toast, styles[toast.type] || styles.info].join(" ")} role={role} aria-live={role === "alert" ? "assertive" : "polite"}>
      <Icon aria-hidden="true" /><span>{toast.message}</span>
      <button type="button" onClick={onClose} aria-label="Dismiss message"><FiX aria-hidden="true" /></button>
    </div>
  );
};

export default Toast;
