from app.data.tickets import create_ticket, delete_ticket, list_tickets, update_ticket


def test_create_ticket_defaults_to_open():
    ticket = create_ticket("Fix login bug", "Balaji")
    assert ticket.status == "open"
    assert ticket.title == "Fix login bug"
    assert ticket.assignee == "Balaji"


def test_list_tickets_filters_by_status():
    create_ticket("Open ticket", "Balaji")
    closed = create_ticket("Closed ticket", "Balaji")
    update_ticket(closed.id, status="closed")

    open_tickets = list_tickets(status="open")
    closed_tickets = list_tickets(status="closed")

    assert all(t.status == "open" for t in open_tickets)
    assert all(t.status == "closed" for t in closed_tickets)
    assert closed.id in [t.id for t in closed_tickets]


def test_update_ticket_partial_update_only_changes_given_fields():
    ticket = create_ticket("Investigate outage", "Balaji")

    updated = update_ticket(ticket.id, status="in_progress")

    assert updated.status == "in_progress"
    assert updated.assignee == "Balaji"


def test_update_ticket_returns_none_for_unknown_id():
    assert update_ticket("TKT-does-not-exist", status="closed") is None


def test_delete_ticket_removes_it():
    ticket = create_ticket("Temporary ticket", "Balaji")

    assert delete_ticket(ticket.id) is True
    assert ticket.id not in [t.id for t in list_tickets()]


def test_delete_ticket_returns_false_for_unknown_id():
    assert delete_ticket("TKT-does-not-exist") is False
