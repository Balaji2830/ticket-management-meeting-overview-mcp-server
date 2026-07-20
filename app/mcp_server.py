from typing import Optional

from mcp.server.fastmcp import FastMCP

from app.data.meetings import list_meetings as _list_meetings
from app.data.tickets import TicketStatus
from app.data.tickets import create_ticket as _create_ticket
from app.data.tickets import list_tickets as _list_tickets
from app.data.tickets import update_ticket as _update_ticket

mcp = FastMCP("ticket-management-meeting-overview-mcp-server")


@mcp.tool()
def ping(message: str = "pong") -> str:
    """Health-check tool that echoes back a message."""
    return message


@mcp.tool()
def list_tickets(status: Optional[TicketStatus] = None) -> list[dict]:
    """List tickets, optionally filtered by status."""
    return [t.model_dump() for t in _list_tickets(status)]


@mcp.tool()
def create_ticket(title: str, assignee: str) -> dict:
    """Create a new ticket with a title and assignee. Status defaults to open."""
    return _create_ticket(title, assignee).model_dump()


@mcp.tool()
def update_ticket(
    id: str, status: Optional[TicketStatus] = None, assignee: Optional[str] = None
) -> dict:
    """Update an existing ticket's status and/or assignee by id."""
    ticket = _update_ticket(id, status=status, assignee=assignee)
    if ticket is None:
        raise ValueError(f'No ticket found with id "{id}".')
    return ticket.model_dump()


@mcp.tool()
def list_meetings(date: Optional[str] = None, attendee: Optional[str] = None) -> list[dict]:
    """List meetings, optionally filtered by date (YYYY-MM-DD) and/or attendee name."""
    return [m.model_dump() for m in _list_meetings(date, attendee)]


if __name__ == "__main__":
    mcp.run(transport="stdio")
