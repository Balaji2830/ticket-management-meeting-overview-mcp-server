from app.data.meetings import create_meeting, delete_meeting, list_meetings, update_meeting


def test_create_meeting():
    meeting = create_meeting(
        "Sprint planning", "2026-07-21", ["Balaji", "Priya"], "Planned next sprint."
    )
    assert meeting.title == "Sprint planning"
    assert meeting.attendees == ["Balaji", "Priya"]


def test_list_meetings_filters_by_date():
    create_meeting("Meeting A", "2026-07-21", ["Balaji"], "summary A")
    create_meeting("Meeting B", "2026-07-22", ["Balaji"], "summary B")

    results = list_meetings(date="2026-07-21")

    assert len(results) == 1
    assert results[0].title == "Meeting A"


def test_list_meetings_filters_by_attendee_case_insensitive():
    create_meeting("Meeting A", "2026-07-21", ["Balaji"], "summary A")
    create_meeting("Meeting B", "2026-07-21", ["Priya"], "summary B")

    results = list_meetings(attendee="balaji")

    assert len(results) == 1
    assert results[0].title == "Meeting A"


def test_update_meeting_partial_update():
    meeting = create_meeting("Draft title", "2026-07-21", ["Balaji"], "draft summary")

    updated = update_meeting(meeting.id, summary="final summary")

    assert updated.title == "Draft title"
    assert updated.summary == "final summary"


def test_update_meeting_returns_none_for_unknown_id():
    assert update_meeting("MTG-does-not-exist", summary="x") is None


def test_delete_meeting_removes_it():
    meeting = create_meeting("Temporary meeting", "2026-07-21", ["Balaji"], "summary")

    assert delete_meeting(meeting.id) is True
    assert meeting.id not in [m.id for m in list_meetings()]


def test_delete_meeting_returns_false_for_unknown_id():
    assert delete_meeting("MTG-does-not-exist") is False
