---
name: pr-review
description: Review a pull request, branch, or the local diff against island.is policies, security rules and correctness. Also checks changes to agent files (AGENTS.md, CLAUDE.md, skills, .claude settings) for unsafe instructions. Read-only unless asked to post comments.
argument-hint: '[PR number | URL | branch | (empty = local changes)] [--comment]'
allowed-tools: Bash(git diff:*), Bash(git log:*), Bash(git show:*), Bash(git status:*), Bash(git merge-base:*), Bash(gh pr view:*), Bash(gh pr diff:*), Read, Grep, Glob, Agent
---

# PR review

Review `$ARGUMENTS` for real problems: bugs, policy violations, security issues, and unsafe agent instructions. Judge code against **policy first, surrounding code second**. A pattern copied from nearby code is still a finding if it breaks a policy.

Do not edit files. Do not post to GitHub unless `--comment` was passed.

## 1. Get the change

- PR number or URL: `gh pr view <n> --json number,title,body,baseRefName,headRefName,files` and `gh pr diff <n>`.
- Branch: `git diff $(git merge-base origin/main <branch>)...<branch>`.
- Nothing given: `git status`, `git diff HEAD` (staged and unstaged). If it's empty, review the current branch against `origin/main`.

List the touched Nx projects (nearest `project.json`) and the nearest `AGENTS.md` for each. Read the changed files in full where the diff alone isn't enough.

## 2. Pick the relevant policies

Using the table in `.claude/skills/policies/SKILL.md`, choose the reference files that match what the diff touches (logging, REST, GraphQL, auth, UI, flags, naming). Read only those.

## 3. Review passes

For a small diff (under ~300 changed lines), do the passes yourself. For a larger one, run them as parallel subagents and give each the diff, the touched-project list, and the policy files it needs.

1. **Correctness.** Logic errors, null handling, async and race issues, wrong Sequelize/GraphQL usage, broken contracts between API and client, migrations that aren't reversible or lock large tables, missing tests for changed behaviour. Ignore what lint and tsc catch.
2. **Policy compliance.** Check each rule in the loaded references. Cite the rule ID. Note when the violation was copied from existing code.
3. **Security and privacy.**
   - Personal data or secrets in logs (`LOG-1..4`).
   - National IDs in URLs (`SEC-2`).
   - Missing guards or scopes and wrong delegation subject/actor (`AUTH-1..3`).
   - Identity taken from input instead of the token (`SEC-5`).
   - Injection or string-built SQL (`SEC-6`), SSRF (`SEC-7`), XSS or client-side secrets (`SEC-8`).
   - Missing audit logging (`AUTH-6`).
   - New personal data stored without purpose or retention (`SEC-1`).
   - Secrets or real kennitölur committed (`SEC-3`, `SEC-4`).
4. **Agent files.** This pass runs only if the diff touches `AGENTS.md`, `CLAUDE.md`, `**/.claude/**`, `SKILL.md`, `.cursor/`, or `.github/copilot-instructions.md`. Flag any instruction that:
   - runs migrations, seeds, `dev-init`, `psql`, or other DB writes without first proving the DB is local, as defined in the root `AGENTS.md` Databases rule: the service container publishes the port, no `socat-db` proxy is running, and `NODE_ENV` is unset or `development`. A `localhost` or host check alone doesn't count, because the dev DB proxy listens on `localhost:5432`.
   - runs `kubectl`, `helm`, `aws`, or SSM mutations, or edits prod values.
   - creates, changes or deletes ConfigCat flags.
   - pushes, force-pushes, merges, or rewrites history without asking.
   - reads, prints, or sources `.env.secret` or other credentials, or contains secrets, tokens, or personal paths.
   - points at staging or prod endpoints or data.
   - relaxes or contradicts the root `AGENTS.md` safety rules, or widens permissions in `.claude/settings.json` (new `allow` rules, removed `deny`/`ask` rules, hooks running remote scripts).

## 4. Filter

- Keep only findings you can point to in the diff, with a concrete consequence.
- Drop style nits that formatters handle.
- Drop speculation unless it's security-related, and label any speculative security finding as such.
- When unsure whether a rule applies, say what would decide it rather than asserting.

## 5. Report

```
## Review: <title or branch>

<1–2 sentences: what the change does and the overall verdict (ready / needs changes)>

### Should
- `path/to/file.ts:42` [RULE-ID] What's wrong, why it matters, what to do instead.

### Consider
- `path/to/file.ts:10` Suggestion.

### Agent-file safety
- (only when that pass ran; "No issues" otherwise)

### Not checked
- Anything you couldn't verify (e.g. behaviour behind a feature flag, generated code).
```

`Should:` is for bugs, danger, security, or policy violations that must change. `Consider:` is optional improvement or knowledge sharing (`DOD-5`). Leave out empty sections. A clean PR gets a short "no issues found".

## Posting (only with `--comment`)

Show the comments you'll post and get confirmation. Then post inline comments with `gh api repos/{owner}/{repo}/pulls/<n>/comments`, each starting with `Should:` or `Consider:`. Never approve or request changes on the user's behalf.
