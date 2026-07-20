from fastapi.testclient import TestClient

from app.api import app

client = TestClient(app)


def test_create_and_list_tickets():
    resp = client.post("/tickets", json={"title": "API ticket", "assignee": "Balaji"})
    assert resp.status_code == 200
    ticket = resp.json()
    assert ticket["status"] == "open"

    resp = client.get("/tickets")
    assert resp.status_code == 200
    assert ticket["id"] in [t["id"] for t in resp.json()]


def test_patch_ticket_not_found_returns_404():
    resp = client.patch("/tickets/TKT-does-not-exist", json={"status": "closed"})
    assert resp.status_code == 404


def test_delete_ticket_lifecycle():
    created = client.post("/tickets", json={"title": "To delete", "assignee": "Balaji"}).json()

    resp = client.delete(f"/tickets/{created['id']}")
    assert resp.status_code == 204

    resp = client.delete(f"/tickets/{created['id']}")
    assert resp.status_code == 404


def test_create_and_list_meetings():
    resp = client.post(
        "/meetings",
        json={
            "title": "API meeting",
            "date": "2026-07-21",
            "attendees": ["Balaji"],
            "summary": "summary",
        },
    )
    assert resp.status_code == 200
    meeting = resp.json()

    resp = client.get("/meetings", params={"attendee": "balaji"})
    assert resp.status_code == 200
    assert meeting["id"] in [m["id"] for m in resp.json()]


def test_patch_meeting_not_found_returns_404():
    resp = client.patch("/meetings/MTG-does-not-exist", json={"summary": "x"})
    assert resp.status_code == 404


def test_delete_meeting_lifecycle():
    created = client.post(
        "/meetings",
        json={"title": "To delete", "date": "2026-07-21", "attendees": ["Balaji"], "summary": "x"},
    ).json()

    resp = client.delete(f"/meetings/{created['id']}")
    assert resp.status_code == 204

    resp = client.delete(f"/meetings/{created['id']}")
    assert resp.status_code == 404
