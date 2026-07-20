import os

os.environ["DATABASE_URL"] = "postgresql+psycopg://postgres:postgres@localhost:5433/ticketdb_test"

import psycopg
import pytest

from app.db import Base, SessionLocal, engine
from app.models import MeetingRow, TicketRow


def _ensure_test_database() -> None:
    admin_conn = psycopg.connect(
        "postgresql://postgres:postgres@localhost:5433/postgres", autocommit=True
    )
    with admin_conn.cursor() as cur:
        cur.execute("SELECT 1 FROM pg_database WHERE datname = 'ticketdb_test'")
        if cur.fetchone() is None:
            cur.execute("CREATE DATABASE ticketdb_test")
    admin_conn.close()


@pytest.fixture(scope="session", autouse=True)
def _test_database():
    _ensure_test_database()
    Base.metadata.create_all(engine)
    yield
    Base.metadata.drop_all(engine)


@pytest.fixture(autouse=True)
def _clean_tables():
    with SessionLocal() as session:
        session.query(MeetingRow).delete()
        session.query(TicketRow).delete()
        session.commit()
    yield
