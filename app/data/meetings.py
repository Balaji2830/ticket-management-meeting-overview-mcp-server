from typing import Optional

from pydantic import BaseModel, ConfigDict
from sqlalchemy import select

from app.db import SessionLocal
from app.models import MeetingRow


class Meeting(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    date: str
    attendees: list[str]
    summary: str


def _next_meeting_id(session) -> str:
    existing_ids = session.scalars(select(MeetingRow.id)).all()
    numbers = [int(i.split("-")[1]) for i in existing_ids if i.startswith("MTG-")]
    return f"MTG-{max(numbers, default=0) + 1}"


def create_meeting(title: str, date: str, attendees: list[str], summary: str) -> Meeting:
    with SessionLocal() as session:
        row = MeetingRow(
            id=_next_meeting_id(session),
            title=title,
            date=date,
            attendees=attendees,
            summary=summary,
        )
        session.add(row)
        session.commit()
        session.refresh(row)
        return Meeting.model_validate(row)


def update_meeting(
    meeting_id: str,
    title: Optional[str] = None,
    date: Optional[str] = None,
    attendees: Optional[list[str]] = None,
    summary: Optional[str] = None,
) -> Optional[Meeting]:
    with SessionLocal() as session:
        row = session.get(MeetingRow, meeting_id)
        if row is None:
            return None
        if title is not None:
            row.title = title
        if date is not None:
            row.date = date
        if attendees is not None:
            row.attendees = attendees
        if summary is not None:
            row.summary = summary
        session.commit()
        session.refresh(row)
        return Meeting.model_validate(row)


def list_meetings(date: Optional[str] = None, attendee: Optional[str] = None) -> list[Meeting]:
    with SessionLocal() as session:
        stmt = select(MeetingRow)
        if date is not None:
            stmt = stmt.where(MeetingRow.date == date)
        rows = session.scalars(stmt.order_by(MeetingRow.id)).all()
        meetings = [Meeting.model_validate(row) for row in rows]
        if attendee is not None:
            needle = attendee.lower()
            meetings = [m for m in meetings if needle in (a.lower() for a in m.attendees)]
        return meetings
