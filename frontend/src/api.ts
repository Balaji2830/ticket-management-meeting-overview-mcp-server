const BASE_URL = "http://127.0.0.1:8000";

export type TicketStatus = "open" | "in_progress" | "closed";

export interface Ticket {
  id: string;
  title: string;
  status: TicketStatus;
  assignee: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  attendees: string[];
  summary: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail ?? `Request failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  listTickets: (status?: TicketStatus) =>
    request<Ticket[]>(`/tickets${status ? `?status=${status}` : ""}`),
  createTicket: (title: string, assignee: string) =>
    request<Ticket>("/tickets", { method: "POST", body: JSON.stringify({ title, assignee }) }),
  updateTicket: (id: string, updates: Partial<Pick<Ticket, "status" | "assignee">>) =>
    request<Ticket>(`/tickets/${id}`, { method: "PATCH", body: JSON.stringify(updates) }),
  deleteTicket: (id: string) => request<void>(`/tickets/${id}`, { method: "DELETE" }),

  listMeetings: (params?: { date?: string; attendee?: string }) => {
    const search = new URLSearchParams();
    if (params?.date) search.set("date", params.date);
    if (params?.attendee) search.set("attendee", params.attendee);
    const qs = search.toString();
    return request<Meeting[]>(`/meetings${qs ? `?${qs}` : ""}`);
  },
  createMeeting: (title: string, date: string, attendees: string[], summary: string) =>
    request<Meeting>("/meetings", {
      method: "POST",
      body: JSON.stringify({ title, date, attendees, summary }),
    }),
  updateMeeting: (id: string, updates: Partial<Omit<Meeting, "id">>) =>
    request<Meeting>(`/meetings/${id}`, { method: "PATCH", body: JSON.stringify(updates) }),
  deleteMeeting: (id: string) => request<void>(`/meetings/${id}`, { method: "DELETE" }),
};
