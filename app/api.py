from typing import Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from app.data.meetings import Meeting
from app.data.meetings import create_meeting as _create_meeting
from app.data.meetings import list_meetings as _list_meetings
from app.data.tickets import Ticket, TicketStatus
from app.data.tickets import create_ticket as _create_ticket
from app.data.tickets import list_tickets as _list_tickets
from app.data.tickets import update_ticket as _update_ticket

app = FastAPI(title="Ticket Management & Meeting Overview API")


class CreateTicketRequest(BaseModel):
    title: str
    assignee: str


class UpdateTicketRequest(BaseModel):
    status: Optional[TicketStatus] = None
    assignee: Optional[str] = None


@app.get("/tickets", response_model=list[Ticket])
def get_tickets(status: Optional[TicketStatus] = None):
    return _list_tickets(status)


@app.post("/tickets", response_model=Ticket)
def post_ticket(body: CreateTicketRequest):
    return _create_ticket(body.title, body.assignee)


@app.patch("/tickets/{ticket_id}", response_model=Ticket)
def patch_ticket(ticket_id: str, body: UpdateTicketRequest):
    ticket = _update_ticket(ticket_id, status=body.status, assignee=body.assignee)
    if ticket is None:
        raise HTTPException(status_code=404, detail=f'No ticket found with id "{ticket_id}".')
    return ticket


class CreateMeetingRequest(BaseModel):
    title: str
    date: str
    attendees: list[str]
    summary: str


@app.get("/meetings", response_model=list[Meeting])
def get_meetings(date: Optional[str] = None, attendee: Optional[str] = None):
    return _list_meetings(date, attendee)


@app.post("/meetings", response_model=Meeting)
def post_meeting(body: CreateMeetingRequest):
    return _create_meeting(body.title, body.date, body.attendees, body.summary)
