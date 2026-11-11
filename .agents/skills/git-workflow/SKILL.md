---
name: git-workflow
description: Git add, commit and push for the Work-summary repo, written for team readability. Use after any change to files in this project, or when the user says commit, push, save to git, or asks for a link to the change.
---

# git-workflow

Keyword rule: use only the words **commit**, **push**, **branch**, **message**, **link**.

Remote: `https://github.com/K-mangda/Work-summary.git` (branch `main`).

## Always do this yourself
After every finished change, the AI runs add, commit and push without being asked. Do not wait for the user to say "commit".

## Steps
1. Confirm the repo root: `git rev-parse --show-toplevel` must end with `/Desktop/Work-summary`. The parent folder `C:\Users\Korawit` is also a git repo. If the root is wrong, stop and run `git init` inside Work-summary. Never commit from the home folder.
2. Run `npm run validate` (data change) or `npm run build` (code change). Fix errors first. Never commit a broken build.
3. `git pull --rebase origin main` to pick up teammates' work. Resolve conflicts, never discard their changes.
4. `git add` only the files of this change (name them). Never add `node_modules/`, `dist/`, secrets or `.env`.
5. One commit per logical change. Do not mix a design change with a work-log update.
6. `git commit` with a clear message (format below).
7. `git push origin main`. Never force push.
8. Report to the user with links (see Report).

## Message format
Subject line, 72 characters max, imperative, with a type prefix:
- `log:` work log data (`data/days/*.json`), e.g. `log: 2026-11-11 Blog - fix article title`
- `feat:` new feature, `fix:` bug fix, `style:` UI only, `docs:` skill or README, `chore:` config

Body (when the change is not obvious): what changed, why, and where. Teammates read this, so write full sentences and name the file or page. No AI jargon, no "as requested".

## Report (after push)
Always give the user clickable links, so they can open and check:
- Commit link: `https://github.com/K-mangda/Work-summary/commit/<sha>`
- A link to each changed file at that commit: `https://github.com/K-mangda/Work-summary/blob/<sha>/<path>` (add `#L10-L20` for the exact lines)
- Summary line per change, e.g. "แก้ข้อความหัวข้อ Blog" + link to the line.
Get `<sha>` from `git rev-parse HEAD` after the commit.

## Gotchas
- Push can be rejected when a teammate pushed first: run `git pull --rebase origin main`, then push again.
- The shell can block access to the project folder (EPERM / Permission denied). Report it to the user, do not work around it.
- Append learned mistakes here (see skill-craft).
