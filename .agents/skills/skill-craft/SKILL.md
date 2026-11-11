---
name: skill-craft
description: Create, update or learn skills. Use when a mistake or retry happened, when the user says remember this, or when asked to create or update a skill or its metadata.
---

# skill-craft

Keyword rule: use only the words **skill**, **metadata**, **keyword**, **mistake**, **update**.

## Create a skill
1. Make `.agents/skills/<skill-name>/SKILL.md`. Name is lowercase-with-hyphens.
2. Metadata (frontmatter) is required: `name` and `description`.
3. `description` states what it does and when to use it, written in the words the user would say. This is what the AI searches on.
4. Body: short steps, data format, gotchas.

## Keyword discipline (inside 1 skill)
- Pick one term per concept and use it everywhere in that skill, in description and body.
- No synonyms. Varied wording makes the AI fail to find the skill.
- Before saving, scan the skill for synonym drift and unify.

## Learn from a mistake
1. After a mistake, retry or user correction, find the root cause.
2. Search existing skills first. If one fits, **update** it: add a line to its Gotchas. Do not create a duplicate skill.
3. If none fits and the lesson is reusable, create a new skill.
4. Keep the lesson short and concrete: what happened, what to do instead.

## Update a skill
- When new knowledge appears, edit the skill in place, keep its keywords unchanged, keep the description accurate.
