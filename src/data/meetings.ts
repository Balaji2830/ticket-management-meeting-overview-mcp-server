export interface Meeting {
  id: string;
  title: string;
  date: string;
  attendees: string[];
  summary: string;
}

export const meetings: Meeting[] = [
  {
    id: "MTG-1",
    title: "Project kickoff",
    date: "2026-07-20",
    attendees: ["Balaji"],
    summary: "Scaffolded the MCP server project and set up GitHub + Notion tracking.",
  },
  {
    id: "MTG-2",
    title: "Ticket tool review",
    date: "2026-07-20",
    attendees: ["Balaji"],
    summary: "Reviewed the list_tickets tool and agreed on mock data for early development.",
  },
];
