-- ============================================================================
--  Resul · Release Calendar — Database schema (PostgreSQL)
-- ----------------------------------------------------------------------------
--  A single "entries" table holds the three entry kinds (release / sprint /
--  leave). Common columns are always populated; the type-specific columns are
--  nullable and only filled for the matching `type`. This mirrors the flat JSON
--  shape the frontend exchanges, keeping the API a thin pass-through.
-- ============================================================================

CREATE TABLE IF NOT EXISTS entries (
    id          TEXT PRIMARY KEY,
    type        TEXT NOT NULL CHECK (type IN ('release', 'sprint', 'leave')),
    color       TEXT NOT NULL,

    -- release ----------------------------------------------------------------
    functionality_name TEXT,
    version            TEXT,
    release_date       DATE,
    module             TEXT,
    release_manager    TEXT,
    release_notes      TEXT,

    -- sprint -----------------------------------------------------------------
    sprint_name  TEXT,
    goal         TEXT,
    start_date   DATE,
    end_date     DATE,
    team_notes   TEXT,

    -- leave ------------------------------------------------------------------
    developer_name TEXT,
    leave_type     TEXT,
    from_date      DATE,
    to_date        DATE,
    duration       TEXT CHECK (duration IS NULL OR duration IN ('full', 'first', 'second')),
    notes          TEXT,

    -- bookkeeping ------------------------------------------------------------
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for the calendar's most common access patterns -----------------------
CREATE INDEX IF NOT EXISTS idx_entries_type        ON entries (type);
CREATE INDEX IF NOT EXISTS idx_entries_release_date ON entries (release_date);
CREATE INDEX IF NOT EXISTS idx_entries_sprint_range ON entries (start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_entries_leave_range  ON entries (from_date, to_date);

-- Keep updated_at fresh on every UPDATE ----------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_entries_updated_at ON entries;
CREATE TRIGGER trg_entries_updated_at
    BEFORE UPDATE ON entries
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
