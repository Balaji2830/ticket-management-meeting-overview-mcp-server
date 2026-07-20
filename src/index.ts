import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { tickets, createTicket, updateTicket, type TicketStatus } from "./data/tickets.js";
import { meetings } from "./data/meetings.js";

const server = new McpServer({
  name: "ticket-management-meeting-overview-mcp-server",
  version: "1.0.0",
});

server.registerTool(
  "ping",
  {
    description: "Health-check tool that echoes back a message.",
    inputSchema: { message: z.string().default("pong") },
  },
  async ({ message }) => ({
    content: [{ type: "text", text: message }],
  })
);

server.registerTool(
  "list_tickets",
  {
    description: "List tickets, optionally filtered by status.",
    inputSchema: {
      status: z.enum(["open", "in_progress", "closed"]).optional(),
    },
  },
  async ({ status }: { status?: TicketStatus }) => {
    const filtered = status ? tickets.filter((t) => t.status === status) : tickets;
    return {
      content: [{ type: "text", text: JSON.stringify(filtered, null, 2) }],
    };
  }
);

server.registerTool(
  "create_ticket",
  {
    description: "Create a new ticket with a title and assignee. Status defaults to open.",
    inputSchema: {
      title: z.string().min(1),
      assignee: z.string().min(1),
    },
  },
  async ({ title, assignee }: { title: string; assignee: string }) => {
    const ticket = createTicket({ title, assignee });
    return {
      content: [{ type: "text", text: JSON.stringify(ticket, null, 2) }],
    };
  }
);

server.registerTool(
  "update_ticket",
  {
    description: "Update an existing ticket's status and/or assignee by id.",
    inputSchema: {
      id: z.string().min(1),
      status: z.enum(["open", "in_progress", "closed"]).optional(),
      assignee: z.string().min(1).optional(),
    },
  },
  async ({
    id,
    status,
    assignee,
  }: {
    id: string;
    status?: TicketStatus;
    assignee?: string;
  }) => {
    const ticket = updateTicket(id, { status, assignee });
    if (!ticket) {
      return {
        isError: true,
        content: [{ type: "text", text: `No ticket found with id "${id}".` }],
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(ticket, null, 2) }],
    };
  }
);

server.registerTool(
  "list_meetings",
  {
    description:
      "List meetings with their date, attendees, and summary. Optionally filter by date (YYYY-MM-DD) and/or attendee name.",
    inputSchema: {
      date: z.string().optional(),
      attendee: z.string().optional(),
    },
  },
  async ({ date, attendee }: { date?: string; attendee?: string }) => {
    let filtered = meetings;
    if (date) {
      filtered = filtered.filter((m) => m.date === date);
    }
    if (attendee) {
      filtered = filtered.filter((m) =>
        m.attendees.some((a) => a.toLowerCase() === attendee.toLowerCase())
      );
    }
    return {
      content: [{ type: "text", text: JSON.stringify(filtered, null, 2) }],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error starting MCP server:", error);
  process.exit(1);
});
