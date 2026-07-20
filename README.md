# Ticket Management & Meeting Overview MCP Server

An MCP (Model Context Protocol) server covering ticket management and meeting
overview functionality, backed by PostgreSQL. Ships with:

- **MCP server** (`app/mcp_server.py`) — stdio transport, built on the official
  Python MCP SDK (`FastMCP`)
- **REST API** (`app/api.py`) — FastAPI, exposing the same operations over HTTP
- Both share the same PostgreSQL-backed data layer (`app/data/`)

## Stack

- Python 3.13
- [FastAPI](https://fastapi.tiangolo.com/) + [Uvicorn](https://www.uvicorn.org/)
- Official [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk)
- [SQLAlchemy](https://www.sqlalchemy.org/) + [psycopg](https://www.psycopg.org/) 3
- PostgreSQL 16 (via Docker)

## Setup

1. **Start PostgreSQL** (requires Docker):

   ```
   docker compose up -d
   ```

   This runs Postgres on host port **5433** (not 5432, since 5432 may already
   be used by another local Postgres install).

2. **Create a virtual environment and install dependencies**:

   ```
   python -m venv .venv
   .venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Configure the database URL**. Copy `.env.example` to `.env` (already
   matches the default docker-compose credentials, so no edits needed for
   local dev):

   ```
   cp .env.example .env
   ```

4. **Create tables and seed initial data**:

   ```
   python -m app.seed
   ```

## Running

- **MCP server** (stdio transport, for use with an MCP client):

  ```
  python -m app.mcp_server
  ```

- **REST API**:

  ```
  uvicorn app.api:app --reload
  ```

  Interactive docs available at `http://127.0.0.1:8000/docs`.

## Running tests

```
pytest tests/ -v
```

Tests run against a separate `ticketdb_test` database (created automatically
on the same Postgres instance), so they never touch your dev data.

## MCP tools / REST endpoints

| Operation                | MCP tool          | REST endpoint                |
| ------------------------- | ------------------ | ----------------------------- |
| Health check              | `ping`             | —                              |
| List tickets               | `list_tickets`      | `GET /tickets`                |
| Create ticket               | `create_ticket`      | `POST /tickets`                |
| Update ticket               | `update_ticket`      | `PATCH /tickets/{id}`           |
| Delete ticket               | `delete_ticket`      | `DELETE /tickets/{id}`          |
| List meetings               | `list_meetings`      | `GET /meetings`                |
| Create meeting               | `create_meeting`      | `POST /meetings`                |
| Update meeting               | `update_meeting`      | `PATCH /meetings/{id}`           |
| Delete meeting               | `delete_meeting`      | `DELETE /meetings/{id}`          |

Tickets have a `status` of `open`, `in_progress`, or `closed`. `list_tickets`
can filter by `status`; `list_meetings` can filter by `date` (exact match) and
`attendee` (case-insensitive).

## Project structure

```
app/
  data/
    tickets.py      # Ticket model + list/create/update/delete, backed by Postgres
    meetings.py      # Meeting model + list/create/update/delete, backed by Postgres
  db.py             # SQLAlchemy engine/session, reads DATABASE_URL
  models.py          # SQLAlchemy ORM models (TicketRow, MeetingRow)
  mcp_server.py       # MCP server exposing all tools
  api.py             # FastAPI app exposing all REST endpoints
  seed.py            # Creates tables and seeds initial data
tests/               # pytest suite (data layer + REST API), isolated test DB
docker-compose.yml    # Local PostgreSQL for development
```
