import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

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

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error starting MCP server:", error);
  process.exit(1);
});
