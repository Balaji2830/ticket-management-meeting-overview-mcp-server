import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { api, type Meeting } from "../api";
import { MeetingCard } from "./MeetingCard";

export function MeetingsSection() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [attendeeFilter, setAttendeeFilter] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [attendees, setAttendees] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    try {
      const data = await api.listMeetings(attendeeFilter ? { attendee: attendeeFilter } : undefined);
      setMeetings(data);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attendeeFilter]);

  async function handleCreate() {
    if (!title.trim() || !date.trim() || !attendees.trim()) return;
    try {
      await api.createMeeting(
        title.trim(),
        date.trim(),
        attendees.split(",").map((a) => a.trim()).filter(Boolean),
        summary.trim(),
      );
      setTitle("");
      setDate("");
      setAttendees("");
      setSummary("");
      refresh();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function handleDelete(id: string) {
    await api.deleteMeeting(id);
    refresh();
  }

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold text-white">Meetings</h2>
        <input
          value={attendeeFilter}
          onChange={(e) => setAttendeeFilter(e.target.value)}
          placeholder="Filter by attendee..."
          className="w-48 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-blue-400/50"
        />
      </div>

      <div className="glass mt-4 grid grid-cols-1 gap-3 rounded-2xl p-4 sm:grid-cols-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Meeting title"
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/30 focus:border-blue-400/50"
        />
        <input
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="Date (YYYY-MM-DD)"
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/30 focus:border-blue-400/50"
        />
        <input
          value={attendees}
          onChange={(e) => setAttendees(e.target.value)}
          placeholder="Attendees (comma separated)"
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/30 focus:border-blue-400/50"
        />
        <input
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Summary"
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/30 focus:border-blue-400/50"
        />
        <button
          onClick={handleCreate}
          className="sm:col-span-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition hover:brightness-110"
        >
          + Create meeting
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {meetings.map((meeting) => (
            <motion.div
              key={meeting.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <MeetingCard meeting={meeting} onDelete={handleDelete} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {meetings.length === 0 && (
        <p className="mt-6 text-center text-white/40">No meetings match this filter.</p>
      )}
    </section>
  );
}
