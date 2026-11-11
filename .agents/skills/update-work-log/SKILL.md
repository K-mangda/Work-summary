---
name: update-work-log
description: Update the Work Summary website. Use when the user reports work done, asks to add, edit, check or mark a task, attach before/after images, or update the work log for a day.
---

# update-work-log

Keyword rule: use only the words **task**, **day**, **status**, **result**, **compare**. Never swap in synonyms.

## Data
- 1 day = 1 file: `data/days/YYYY-MM-DD.json` (filename must equal `date`).
- Images: `public/assets/YYYY-MM-DD/<task-id>-before.png`, `<task-id>-after.png`.

```json
{
  "date": "YYYY-MM-DD",
  "summary": "one-line summary of the day",
  "groups": [{
    "name": "Blog",
    "groups": [{"name": "Backoffice", "tasks": [ ...task... ]}],   // optional nesting
    "tasks": [{
    "id": "t1",                       // unique within the day
    "title": "short task title",
    "status": "todo|doing|done|blocked",
    "checked": true,                  // true when status is done
    "result": "what changed / outcome",
    "notes": "problems, remarks",
    "tags": ["web"],                  // reuse existing tags, do not invent near-duplicates
    "subtasks": [{"title": "sub item", "checked": true, "note": ""}],  // optional, use for many small items
    "compare": {"before": "assets/..", "after": "assets/..", "caption": ""}  // optional
    }]
  }]
}
```

## Intake: report pasted from another chat
Work happens in other chats (one chat per project). The user pastes a report made with `handoff-prompt.md` (same folder) and says "บันทึกลงเว็บวันนี้". Steps:
1. `git pull --rebase origin main` first: other chats may have changed the same day file.
2. Read the existing `data/days/<date>.json` and **merge**: add or edit only the report's group. Never overwrite other groups.
3. Map the report: `โปรเจกต์` -> top-level group `name`; `หมวดย่อย` -> nested group `name` (skip when `-`); each `### งาน` -> one task; `หัวข้อย่อย` -> `subtasks`.
4. Reuse the exact existing group names (same spelling and case). If the report's name differs only by case or spelling, use the existing name.
5. Tick rule for reports: `checked: true` only when the report says `ตรวจแล้ว: ใช่` with a method. If status is `done` but not verified, set `status: doing`, `checked: false`, and tell the user which tasks need verification. Never tick on trust.
6. Rewrite text as professional work content (remove any AI, chat or command wording). Do not invent details missing from the report.
7. Continue with the Steps below (images, validate, git-workflow, links).

## Steps
1. Get today's date. Open `data/days/<date>.json`; create it if missing.
2. Add a new task or edit the existing task (match by title, do not duplicate). Keep `id` stable.
3. Set `status`, `checked`, and fill `result` with real outcome, not a plan.
4. If the user gives images, copy them into `public/assets/<date>/` and fill `compare` with paths like `assets/<date>/x.png` (no `public/` prefix).
5. Run `npm run validate` (checks filename, id, status). Fix any error it prints. No bundling step: the site reads `data/days/*.json` directly.
6. Follow `.agents/skills/git-workflow/SKILL.md`: add, commit and push, then report which task changed **with links** (commit link and file/line links) so the user can click to check. View locally with `npm run dev`.

## Gotchas
- Wrong `status` value or duplicate `id` makes the build fail.
- Do not delete old days unless the user asks.
- Website text must read as professional work content. Never write AI instructions, tool or command names, "ask the AI", or mentions of AI/chat in `summary`, `title`, `result`, `notes`, `caption`, `subtasks`.
- Structure: day -> `groups` (project, e.g. Blog, OnesiamFactory) -> nested `groups` (e.g. Backoffice, Frontend) -> `tasks`. Nest `groups` as deep as needed. A day has no top-level `tasks`. Keep `group` names identical across days (same spelling and case).
- Tick rule: the AI sets `checked`. Set `checked: true` only after verifying the task is really done (check the code, files or output); otherwise leave `checked: false`. `status: done` requires `checked: true` (validate fails otherwise). The user may present this site to the boss, so a tick must be truthful.
- Many small items under one task: use `subtasks`, not many separate tasks.
- The website is view-only. The site shows `checked`; the user cannot tick it in the browser.
- Append learned mistakes here (see skill-craft).

