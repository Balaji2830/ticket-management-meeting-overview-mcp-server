from typing import Optional

from mcp.server.fastmcp import FastMCP

from app.data.meetings import create_meeting as _create_meeting
from app.data.meetings import delete_meeting as _delete_meeting
from app.data.meetings import list_meetings as _list_meetings
from app.data.meetings import update_meeting as _update_meeting
from app.data.tickets import TicketStatus
from app.data.tickets import create_ticket as _create_ticket
from app.data.tickets import delete_ticket as _delete_ticket
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
def delete_ticket(id: str) -> dict:
    """Delete a ticket by id."""
    if not _delete_ticket(id):
        raise ValueError(f'No ticket found with id "{id}".')
    return {"deleted": id}


@mcp.tool()
def list_meetings(date: Optional[str] = None, attendee: Optional[str] = None) -> list[dict]:
    """List meetings, optionally filtered by date (YYYY-MM-DD) and/or attendee name."""
    return [m.model_dump() for m in _list_meetings(date, attendee)]


@mcp.tool()
def create_meeting(title: str, date: str, attendees: list[str], summary: str) -> dict:
    """Create a new meeting with a title, date (YYYY-MM-DD), attendee list, and summary."""
    return _create_meeting(title, date, attendees, summary).model_dump()


@mcp.tool()
def update_meeting(
    id: str,
    title: Optional[str] = None,
    date: Optional[str] = None,
    attendees: Optional[list[str]] = None,
    summary: Optional[str] = None,
) -> dict:
    """Update an existing meeting's title, date, attendees, and/or summary by id."""
    meeting = _update_meeting(id, title=title, date=date, attendees=attendees, summary=summary)
    if meeting is None:
        raise ValueError(f'No meeting found with id "{id}".')
    return meeting.model_dump()


@mcp.tool()
def delete_meeting(id: str) -> dict:
    """Delete a meeting by id."""
    if not _delete_meeting(id):
        raise ValueError(f'No meeting found with id "{id}".')
    return {"deleted": id}


if __name__ == "__main__":
    mcp.run(transport="stdio")
