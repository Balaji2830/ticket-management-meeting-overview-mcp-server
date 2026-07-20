from typing import Literal, Optional

from pydantic import BaseModel

TicketStatus = Literal["open", "in_progress", "closed"]


class Ticket(BaseModel):
    id: str
    title: str
    status: TicketStatus
    assignee: str


tickets: list[Ticket] = [
    Ticket(id="TKT-1", title="Set up MCP server project", status="closed", assignee="Balaji"),
    Ticket(id="TKT-2", title="Add ticket listing tool", status="in_progress", assignee="Balaji"),
    Ticket(id="TKT-3", title="Add meeting overview tool", status="open", assignee="Balaji"),
]

_next_ticket_number = len(tickets) + 1


def list_tickets(status: Optional[TicketStatus] = None) -> list[Ticket]:
    if status is None:
        return tickets
    return [t for t in tickets if t.status == status]


def create_ticket(title: str, assignee: str) -> Ticket:
    global _next_ticket_number
    ticket = Ticket(id=f"TKT-{_next_ticket_number}", title=title, status="open", assignee=assignee)
    _next_ticket_number += 1
    tickets.append(ticket)
    return ticket


def update_ticket(
    ticket_id: str,
    status: Optional[TicketStatus] = None,
    assignee: Optional[str] = None,
) -> Optional[Ticket]:
    for ticket in tickets:
        if ticket.id == ticket_id:
            if status is not None:
                ticket.status = status
            if assignee is not None:
                ticket.assignee = assignee
            return ticket
    return None
