import type { Meeting } from "../api";
import { TiltCard } from "./TiltCard";

interface MeetingCardProps {
  meeting: Meeting;
  onDelete: (id: string) => void;
}

export function MeetingCard({ meeting, onDelete }: MeetingCardProps) {
  return (
    <TiltCard className="p-5" glowColor="96,165,250">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium tracking-wide text-white/40">{meeting.id}</p>
          <h3 className="mt-1 text-lg font-semibold text-white">{meeting.title}</h3>
        </div>
        <button
          onClick={() => onDelete(meeting.id)}
          className="rounded-lg p-1.5 text-white/30 transition hover:bg-white/10 hover:text-red-400"
          title="Delete meeting"
        >
          ✕
        </button>
      </div>

      <p className="mt-3 text-sm text-white/70">{meeting.summary}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-blue-500/15 px-2.5 py-1 text-xs font-medium text-blue-300">
          {meeting.date}
        </span>
        {meeting.attendees.map((a) => (
          <span key={a} className="rounded-full bg-white/8 px-2.5 py-1 text-xs text-white/60">
            {a}
          </span>
        ))}
      </div>
    </TiltCard>
  );
}
