import { useState, useMemo, useRef, useEffect, useId } from "react";
import "./MemberAssignPicker.css";

function sortMembers(list) {
  const rank = (role) =>
    role === "admin" ? 0 : role === "member" ? 1 : 2;
  return [...list].sort((a, b) => {
    const rd = rank(a.role) - rank(b.role);
    if (rd !== 0) return rd;
    return (a.user?.name || "").localeCompare(b.user?.name || "", undefined, {
      sensitivity: "base",
    });
  });
}

function normalizeProjectMembers(members) {
  return sortMembers(
    members
      .filter((m) => m.user?._id)
      .map((m) => ({
        user: m.user,
        role: m.role === "admin" ? "admin" : "member",
      }))
  );
}

export default function MemberAssignPicker({
  members = [],
  value,
  onChange,
  disabled = false,
  label = "Assign to member",
  placeholder = "Search by name or email…",
  showRoleBadge = true,
  showHint = true,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef(null);
  const listId = useId();
  const inputId = useId();

  const sorted = useMemo(() => {
    return normalizeProjectMembers(members);
  }, [members]);

  const selected = useMemo(() => {
    const id = value?.toString();
    if (!id) return null;
    let found = sorted.find((m) => m.user._id?.toString() === id);
    if (found) return found;
    return normalizeProjectMembers(members).find(
      (m) => m.user._id?.toString() === id
    );
  }, [sorted, members, value]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter(
      (m) =>
        m.user.name?.toLowerCase().includes(q) ||
        m.user.email?.toLowerCase().includes(q)
    );
  }, [sorted, query]);

  useEffect(() => {
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const pick = (member) => {
    onChange(member.user._id.toString());
    setQuery("");
    setOpen(false);
  };

  const clearSelection = () => {
    onChange("");
    setQuery("");
    setOpen(false);
  };

  const closedLabel = selected
    ? `${selected.user.name} (${selected.user.email})`
    : "";

  return (
    <div
      className={`member-assign-picker ${disabled ? "member-assign-picker--disabled" : ""} ${className}`.trim()}
      ref={wrapRef}
    >
      {label ? (
        <label className="member-assign-picker__label" htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <div className="member-assign-picker__control">
        <input
          id={inputId}
          type="text"
          className="member-assign-picker__input"
          disabled={disabled}
          placeholder={placeholder}
          value={open ? query : closedLabel}
          onChange={(e) => {
            const v = e.target.value;
            setQuery(v);
            setOpen(true);
            if (!v) onChange("");
          }}
          onFocus={() => {
            if (disabled) return;
            setOpen(true);
            setQuery("");
          }}
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={listId}
        />
        {selected && !disabled && (
          <button
            type="button"
            className="member-assign-picker__clear"
            onClick={clearSelection}
            aria-label="Clear assignee"
          >
            ×
          </button>
        )}
      </div>
      {open && !disabled && (
        <ul className="member-assign-picker__list" id={listId} role="listbox">
          {filtered.length === 0 ? (
            <li className="member-assign-picker__empty">
              No members match
            </li>
          ) : (
            filtered.map((m) => (
              <li key={m.user._id}>
                <button
                  type="button"
                  className="member-assign-picker__option"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(m)}
                >
                  <span className="member-assign-picker__name">{m.user.name}</span>
                  <span className="member-assign-picker__email">{m.user.email}</span>
                  {showRoleBadge ? (
                    <span
                      className={`member-assign-picker__role member-assign-picker__role--${m.role}`}
                    >
                      {m.role === "admin" ? "Admin" : "Member"}
                    </span>
                  ) : null}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
      {showHint ? (
        <p className="member-assign-picker__hint">
          {sorted.length} project member{sorted.length !== 1 ? "s" : ""} in this project.
        </p>
      ) : null}
    </div>
  );
}
