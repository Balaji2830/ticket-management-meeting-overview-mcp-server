import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { api, type Ticket, type TicketStatus } from "../api";
import { TicketCard } from "./TicketCard";

export function TicketsSection() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filter, setFilter] = useState<TicketStatus | "all">("all");
  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    try {
      const data = await api.listTickets(filter === "all" ? undefined : filter);
      setTickets(data);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function handleCreate() {
    if (!title.trim() || !assignee.trim()) return;
    try {
      await api.createTicket(title.trim(), assignee.trim());
      setTitle("");
      setAssignee("");
      refresh();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function handleStatusChange(id: string, status: TicketStatus) {
    await api.updateTicket(id, { status });
    refresh();
  }

  async function handleDelete(id: string) {
    await api.deleteTicket(id);
    refresh();
  }

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold text-white">Tickets</h2>
        <div className="flex gap-2">
          {(["all", "open", "in_progress", "closed"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-3 py-1.5 text-sm transition ${
                filter === s
                  ? "glass-strong text-white"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              {s === "all" ? "All" : s === "in_progress" ? "In progress" : s[0].toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="glass mt-4 flex flex-wrap gap-3 rounded-2xl p-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New ticket title"
          className="min-w-[200px] flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/30 focus:border-violet-400/50"
        />
        <input
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          placeholder="Assignee"
          className="w-40 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/30 focus:border-violet-400/50"
        />
        <button
          onClick={handleCreate}
          className="rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-violet-500/20 transition hover:brightness-110"
        >
          + Create ticket
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {tickets.map((ticket) => (
            <motion.div
              key={ticket.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <TicketCard ticket={ticket} onStatusChange={handleStatusChange} onDelete={handleDelete} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {tickets.length === 0 && (
        <p className="mt-6 text-center text-white/40">No tickets match this filter.</p>
      )}
    </section>
  );
}
