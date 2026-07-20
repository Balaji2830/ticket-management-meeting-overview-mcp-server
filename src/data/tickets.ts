export type TicketStatus = "open" | "in_progress" | "closed";

export interface Ticket {
  id: string;
  title: string;
  status: TicketStatus;
  assignee: string;
}

export const tickets: Ticket[] = [
  { id: "TKT-1", title: "Set up MCP server project", status: "closed", assignee: "Balaji" },
  { id: "TKT-2", title: "Add ticket listing tool", status: "in_progress", assignee: "Balaji" },
  { id: "TKT-3", title: "Add meeting overview tool", status: "open", assignee: "Balaji" },
];

let nextTicketNumber = tickets.length + 1;

export function createTicket(input: { title: string; assignee: string }): Ticket {
  const ticket: Ticket = {
    id: `TKT-${nextTicketNumber++}`,
    title: input.title,
    status: "open",
    assignee: input.assignee,
  };
  tickets.push(ticket);
  return ticket;
}
