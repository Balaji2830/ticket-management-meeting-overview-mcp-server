import type { Ticket, TicketStatus } from "../api";
import { TiltCard } from "./TiltCard";

const STATUS_STYLES: Record<TicketStatus, { label: string; dot: string; text: string }> = {
  open: { label: "Open", dot: "bg-sky-400", text: "text-sky-300" },
  in_progress: { label: "In progress", dot: "bg-amber-400", text: "text-amber-300" },
  closed: { label: "Closed", dot: "bg-emerald-400", text: "text-emerald-300" },
};

interface TicketCardProps {
  ticket: Ticket;
  onStatusChange: (id: string, status: TicketStatus) => void;
  onDelete: (id: string) => void;
}

export function TicketCard({ ticket, onStatusChange, onDelete }: TicketCardProps) {
  const status = STATUS_STYLES[ticket.status];

  return (
    <TiltCard className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium tracking-wide text-white/40">{ticket.id}</p>
          <h3 className="mt-1 text-lg font-semibold text-white">{ticket.title}</h3>
        </div>
        <button
          onClick={() => onDelete(ticket.id)}
          className="rounded-lg p-1.5 text-white/30 transition hover:bg-white/10 hover:text-red-400"
          title="Delete ticket"
        >
          ✕
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-white/60">{ticket.assignee}</span>
        <div className="flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${status.dot}`} />
          <span className={`text-sm font-medium ${status.text}`}>{status.label}</span>
        </div>
      </div>

      <select
        value={ticket.status}
        onChange={(e) => onStatusChange(ticket.id, e.target.value as TicketStatus)}
        className="mt-4 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 outline-none focus:border-violet-400/50"
      >
        <option value="open" className="bg-[#16161f]">Open</option>
        <option value="in_progress" className="bg-[#16161f]">In progress</option>
        <option value="closed" className="bg-[#16161f]">Closed</option>
      </select>
    </TiltCard>
  );
}
