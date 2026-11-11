# Work-summary

Static website that shows the daily work log. The AI chat maintains the data.

- To add or change work: read and follow `.agents/skills/update-work-log/SKILL.md`.
- After any mistake, correction, or new learning: follow `.agents/skills/skill-craft/SKILL.md` (create or update a skill, keep keywords consistent within one skill).
- After any change: follow `.agents/skills/git-workflow/SKILL.md` (add, commit, push by yourself, then report with clickable links).
- Stack: Vite + React + TypeScript. Data lives in `data/days/*.json` (read directly, no bundling step).
- Run: `npm install` once, then `npm run dev`. Check data: `npm run validate`. Production: `npm run build` (output in `dist/`). On Windows PowerShell use `npm.cmd` if `npm` is blocked.

