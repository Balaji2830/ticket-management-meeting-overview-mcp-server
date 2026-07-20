from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict
from sqlalchemy import select

from app.db import SessionLocal
from app.models import TicketRow

TicketStatus = Literal["open", "in_progress", "closed"]


class Ticket(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    status: TicketStatus
    assignee: str


def _next_ticket_id(session) -> str:
    existing_ids = session.scalars(select(TicketRow.id)).all()
    numbers = [int(i.split("-")[1]) for i in existing_ids if i.startswith("TKT-")]
    return f"TKT-{max(numbers, default=0) + 1}"


def list_tickets(status: Optional[TicketStatus] = None) -> list[Ticket]:
    with SessionLocal() as session:
        stmt = select(TicketRow)
        if status is not None:
            stmt = stmt.where(TicketRow.status == status)
        rows = session.scalars(stmt.order_by(TicketRow.id)).all()
        return [Ticket.model_validate(row) for row in rows]


def create_ticket(title: str, assignee: str) -> Ticket:
    with SessionLocal() as session:
        row = TicketRow(id=_next_ticket_id(session), title=title, status="open", assignee=assignee)
        session.add(row)
        session.commit()
        session.refresh(row)
        return Ticket.model_validate(row)


def update_ticket(
    ticket_id: str,
    status: Optional[TicketStatus] = None,
    assignee: Optional[str] = None,
) -> Optional[Ticket]:
    with SessionLocal() as session:
        row = session.get(TicketRow, ticket_id)
        if row is None:
            return None
        if status is not None:
            row.status = status
        if assignee is not None:
            row.assignee = assignee
        session.commit()
        session.refresh(row)
        return Ticket.model_validate(row)


def delete_ticket(ticket_id: str) -> bool:
    with SessionLocal() as session:
        row = session.get(TicketRow, ticket_id)
        if row is None:
            return False
        session.delete(row)
        session.commit()
        return True
