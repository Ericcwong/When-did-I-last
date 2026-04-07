import { formatTimeAgo } from '../../utils/time';

interface TimerDisplayProps {
  lastCompletedAt: string | null;
  urgencyColor: string;
}

export function TimerDisplay({ lastCompletedAt, urgencyColor }: TimerDisplayProps) {
  if (!lastCompletedAt) {
    return <span style={{ color: urgencyColor }} className="text-sm font-semibold">Never</span>;
  }

  return (
    <span style={{ color: urgencyColor }} className="text-sm font-semibold">
      {formatTimeAgo(new Date(lastCompletedAt))}
    </span>
  );
}
