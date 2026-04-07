import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion';
import type { TaskWithStatus } from '../../types';
import { getCategoryById } from '../../utils/categories';
import { getIconStyles, getIconGlow, getDecayAccent } from '../../utils/iconEffects';
import { TimerDisplay } from '../shared/TimerDisplay';
import { DoneButton } from '../task/DoneButton';

interface TaskCardProps {
  task: TaskWithStatus;
  onComplete: (taskId: string) => void;
}

export function TaskCard({ task, onComplete }: TaskCardProps) {
  const navigate = useNavigate();
  const category = getCategoryById(task.categoryId);
  const x = useMotionValue(0);
  const bgOpacity = useTransform(x, [0, 100], [0, 1]);

  const icon = task.icon ?? category.icon;
  const iconStyles = getIconStyles(task.percentElapsed);
  const iconGlow = getIconGlow(task.urgencyColor, task.percentElapsed);
  const decayAccent = getDecayAccent(task.percentElapsed);

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x > 100) {
      onComplete(task.id);
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Swipe reveal background */}
      <motion.div
        style={{ opacity: bgOpacity }}
        className="absolute inset-0 bg-emerald-500/20 flex items-center pl-6 rounded-2xl"
      >
        <span className="text-emerald-400 font-semibold text-sm">Done!</span>
      </motion.div>

      <motion.div
        style={{
          x,
          backgroundColor: `color-mix(in srgb, ${task.urgencyColor} 8%, rgb(30 41 59))`,
        }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.3}
        onDragEnd={handleDragEnd}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate(`/task/${task.id}`)}
        layout
        className="relative rounded-2xl p-4 cursor-pointer active:bg-slate-800"
      >
        {/* Urgency color bar */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
          style={{ backgroundColor: task.urgencyColor }}
        />

        <div className="flex items-start gap-3 pl-2">
          {/* Icon with degradation effects */}
          <div className="relative mt-0.5">
            <span
              className="text-2xl block"
              style={{
                ...iconStyles,
                boxShadow: iconGlow,
                borderRadius: '8px',
              }}
            >
              {icon}
            </span>
            {decayAccent && (
              <span className="absolute -bottom-1 -right-1 text-xs">{decayAccent}</span>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-slate-100 truncate">{task.name}</h3>
              <DoneButton onDone={() => onComplete(task.id)} />
            </div>

            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-slate-500">{category.label}</span>
              <span className="text-xs text-slate-600">·</span>
              <TimerDisplay lastCompletedAt={task.lastCompletedAt} urgencyColor={task.urgencyColor} />
            </div>

            <p
              className="text-xs mt-1.5 italic"
              style={{ color: task.urgencyColor }}
            >
              {task.personalityMessage}
            </p>
          </div>
        </div>

        {/* Streak badge */}
        {task.streakCount > 1 && (
          <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-amber-500/15 text-amber-400 text-xs font-medium px-1.5 py-0.5 rounded-full">
            <span>🔥</span>
            <span>{task.streakCount}</span>
          </div>
        )}
      </motion.div>
    </div>
  );
}
