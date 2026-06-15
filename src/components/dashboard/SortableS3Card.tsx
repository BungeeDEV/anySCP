import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { S3Connection } from "../../types";
import { S3Card } from "./S3Card";

interface SortableS3CardProps {
  conn: S3Connection;
  onConnect: (conn: S3Connection) => void;
  onEdit: (conn: S3Connection) => void;
  onDuplicate: (conn: S3Connection) => void;
  onDelete: (conn: S3Connection) => void;
}

/**
 * Wraps {@link S3Card} with drag-and-drop reordering — the mirror of
 * {@link SortableHostCard}. The whole card is the drag surface; the dashboard's
 * sensors require a ~5px move (mouse) or a 250ms press (touch) before a drag
 * begins, so a plain click still falls through to the card's connect action.
 */
export function SortableS3Card({ conn, ...cardProps }: SortableS3CardProps) {
  const { listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: conn.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    // Lift the dragged card above its neighbours and dim it so the drop target
    // reads clearly. @dnd-kit drives the position; we only style the feedback.
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      // touch-none lets the TouchSensor own the gesture once a drag begins
      // instead of the browser scrolling the page.
      className="relative h-full touch-none"
      {...listeners}
    >
      <S3Card conn={conn} {...cardProps} />
    </div>
  );
}
