import React from 'react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer
}) => {
  const modalRef = useFocusTrap(isOpen, onClose);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="cp-modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cp-modal-title"
    >
      <div className="cp-modal-content" ref={modalRef} tabIndex={-1}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid var(--cp-border-subtle)'
        }}>
          <h3 id="cp-modal-title" style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--cp-text-primary)' }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--cp-text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
              borderRadius: 'var(--cp-radius-sm)',
              transition: 'color var(--cp-transition-fast)'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px' }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div style={{
            padding: '16px 20px',
            borderTop: '1px solid var(--cp-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '12px',
            backgroundColor: 'rgba(17, 24, 39, 0.4)',
            borderBottomLeftRadius: 'var(--cp-radius-lg)',
            borderBottomRightRadius: 'var(--cp-radius-lg)'
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
