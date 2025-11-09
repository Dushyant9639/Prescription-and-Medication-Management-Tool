import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, EyeOff } from 'lucide-react';

const DraggableWidget = ({ id, children, isEditMode, isVisible, onToggleVisibility, title }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !isEditMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : isVisible ? 1 : 0.6,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative ${!isVisible ? 'pointer-events-none' : ''}`}
    >
      {isEditMode && (
        <div className="absolute -top-3 right-2 z-10 flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-lg border border-gray-200 dark:border-gray-700">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            title="Drag to reorder"
          >
            <GripVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {title}
          </span>
          <button
            onClick={() => onToggleVisibility(id)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            title={isVisible ? 'Hide widget' : 'Show widget'}
          >
            {isVisible ? (
              <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            ) : (
              <EyeOff className="w-4 h-4 text-gray-400 dark:text-gray-600" />
            )}
          </button>
        </div>
      )}
      <div className={`${!isVisible && !isEditMode ? 'hidden' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default DraggableWidget;
