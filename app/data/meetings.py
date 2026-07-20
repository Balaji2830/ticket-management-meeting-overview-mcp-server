from typing import Optional

from pydantic import BaseModel


class Meeting(BaseModel):
    id: str
    title: str
    date: str
    attendees: list[str]
    summary: str


meetings: list[Meeting] = [
    Meeting(
        id="MTG-1",
        title="Project kickoff",
        date="2026-07-20",
        attendees=["Balaji"],
        summary="Scaffolded the MCP server project and set up GitHub + Notion tracking.",
    ),
    Meeting(
        id="MTG-2",
        title="Ticket tool review",
        date="2026-07-20",
        attendees=["Balaji"],
        summary="Reviewed the list_tickets tool and agreed on mock data for early development.",
    ),
]


def list_meetings(date: Optional[str] = None, attendee: Optional[str] = None) -> list[Meeting]:
    filtered = meetings
    if date is not None:
        filtered = [m for m in filtered if m.date == date]
    if attendee is not None:
        needle = attendee.lower()
        filtered = [m for m in filtered if needle in (a.lower() for a in m.attendees)]
    return filtered
