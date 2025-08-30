import { createPortal } from "react-dom";
import styled from "./Modal.module.css";
import { Photo } from "../../types/photo";
import { useEffect } from "react";

interface ModalProps{
  photo: Photo;
  onClose: () => void;
}

const modalRoot = document.getElementById('modal-root') as HTMLElement;

export default function Modal({ photo, onClose }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const disableScroll = () => {
      document.body.style.overflow = "hidden";
    };

    const enableScroll = () => {
      document.body.style.overflow = "";
    }

    window.addEventListener('keydown', handleKeyDown);
    disableScroll();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      enableScroll();
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div className={styled.backdrop} role="dialog" aria-modal="true" onClick={handleBackdropClick}>
      <div className={styled.modal}>
        <button className={styled.closeButton} onClick={onClose } aria-label="Close modal">
          &times;
        </button>
        <img src={photo.src.original} alt={photo.alt} />
      </div>
    </div>,
    modalRoot
  );
}
