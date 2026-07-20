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
