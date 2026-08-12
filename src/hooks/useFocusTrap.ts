import { useEffect, useRef } from 'react';

export function useFocusTrap(isOpen: boolean, onClose: () => void) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previousActiveElement.current = document.activeElement as HTMLElement;

    const getFocusableElements = () => {
      if (!containerRef.current) return [];
      return Array.from(
        containerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter(el => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true');
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const focusable = getFocusableElements();
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    // Auto focus first element
    setTimeout(() => {
      const focusable = getFocusableElements();
      if (focusable.length > 0) {
        focusable[0].focus();
      } else if (containerRef.current) {
        containerRef.current.focus();
      }
    }, 50);

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, onClose]);

  return containerRef;
}
