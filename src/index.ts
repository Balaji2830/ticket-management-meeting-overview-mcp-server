import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { tickets, type TicketStatus } from "./data/tickets.js";
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
  "list_meetings",
  {
    description: "List meetings with their date, attendees, and summary.",
    inputSchema: {},
  },
  async () => ({
    content: [{ type: "text", text: JSON.stringify(meetings, null, 2) }],
  })
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error starting MCP server:", error);
  process.exit(1);
});
