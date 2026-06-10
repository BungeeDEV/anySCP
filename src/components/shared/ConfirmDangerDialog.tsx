import { useEffect, useId } from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDangerDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDangerDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmDangerDialogProps) {
  const titleId = useId();

  // Escape closes the dialog — document listener matches GroupDeleteDialog and
  // HostEditModal so it fires regardless of which element has focus.
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) {
        e.stopPropagation();
        onCancel();
      }
    };
    document.addEventListener("keydown", handler, true);
    return () => document.removeEventListener("keydown", handler, true);
  }, [open, busy, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[8vh] bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget && !busy) onCancel(); }}
    >
      {/* Wrap in a form so Enter on the focused Confirm button submits naturally */}
      <form
        onSubmit={(e) => { e.preventDefault(); if (!busy) onConfirm(); }}
        aria-modal="true"
        role="dialog"
        aria-labelledby={titleId}
        className="w-full max-w-sm rounded-xl bg-bg-overlay border border-border shadow-[var(--shadow-lg)] flex flex-col animate-in fade-in slide-in-from-top-2 duration-[var(--duration-base)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-md shrink-0 bg-status-error/10">
              <AlertTriangle size={15} strokeWidth={1.8} className="text-status-error" aria-hidden="true" />
            </div>
            <h2 id={titleId} className="text-[length:var(--text-lg)] font-semibold text-text-primary">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            aria-label="Close"
            className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-bg-subtle transition-colors duration-[var(--duration-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          >
            <X size={14} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          <p className="text-[length:var(--text-sm)] text-text-secondary">{message}</p>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 pt-3 flex items-center justify-end gap-2 border-t border-border shrink-0">
          <button
            // autoFocus lands on Cancel (the safe default) synchronously on mount.
            // This is more reliable than a requestAnimationFrame focus() call.
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            type="button"
            onClick={onCancel}
            disabled={busy}
            className={[
              "px-4 py-2 rounded-lg text-[length:var(--text-sm)] font-medium",
              "text-text-secondary hover:text-text-primary",
              "transition-colors duration-[var(--duration-fast)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "disabled:opacity-50 disabled:pointer-events-none",
            ].join(" ")}
          >
            {cancelLabel}
          </button>
          <button
            type="submit"
            disabled={busy}
            className={[
              "px-4 py-2 rounded-lg text-[length:var(--text-sm)] font-medium",
              "bg-status-error text-text-inverse",
              "hover:opacity-90 active:opacity-80",
              "transition-opacity duration-[var(--duration-fast)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "disabled:opacity-50 disabled:pointer-events-none",
            ].join(" ")}
          >
            {busy ? "Deleting…" : confirmLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
