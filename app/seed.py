from app.db import Base, SessionLocal, engine
from app.models import MeetingRow, TicketRow

SEED_TICKETS = [
    TicketRow(id="TKT-1", title="Set up MCP server project", status="closed", assignee="Balaji"),
    TicketRow(id="TKT-2", title="Add ticket listing tool", status="in_progress", assignee="Balaji"),
    TicketRow(id="TKT-3", title="Add meeting overview tool", status="open", assignee="Balaji"),
]

SEED_MEETINGS = [
    MeetingRow(
        id="MTG-1",
        title="Project kickoff",
        date="2026-07-20",
        attendees=["Balaji"],
        summary="Scaffolded the MCP server project and set up GitHub + Notion tracking.",
    ),
    MeetingRow(
        id="MTG-2",
        title="Ticket tool review",
        date="2026-07-20",
        attendees=["Balaji"],
        summary="Reviewed the list_tickets tool and agreed on mock data for early development.",
    ),
]


def main() -> None:
    Base.metadata.create_all(engine)
    with SessionLocal() as session:
        if session.query(TicketRow).count() == 0:
            session.add_all(SEED_TICKETS)
        if session.query(MeetingRow).count() == 0:
            session.add_all(SEED_MEETINGS)
        session.commit()


if __name__ == "__main__":
    main()
