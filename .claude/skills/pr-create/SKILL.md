---
name: pr-create
description: Open a pull request for the current branch with a Conventional Commits title that passes PR lint and a body following the island.is PR template. Runs lint, typecheck and tests for the touched projects first.
argument-hint: '[--draft] [title hint]'
disable-model-invocation: true
allowed-tools: Bash(git diff:*), Bash(git log:*), Bash(git status:*), Bash(git branch:*), Bash(git rev-parse:*), Bash(git merge-base:*), Bash(git push:*), Bash(gh pr create:*), Bash(gh pr view:*), Bash(yarn nx:*), Bash(yarn tsc:*), Read, Grep, Glob, AskUserQuestion
---

# Create a pull request

Open a PR from the current branch to `main`. Arguments: `$ARGUMENTS`.

## 1. Check the branch

- Stop if the current branch is `main` or `release/*`.
- Stop if there are uncommitted changes, unless the user says to leave them out.
- Check the branch name is `<type>/<short-description>` in lowercase. If it isn't, mention it, but don't rename a pushed branch.
- Read `git log origin/main..HEAD --oneline` and `git diff origin/main...HEAD --stat`, then the full diff.

## 2. Verify

Find the touched Nx projects (nearest `project.json` for each changed file). For each project:

- `yarn nx lint <project>`
- `yarn tsc --noEmit -p <project-root>/tsconfig.app.json` (or `tsconfig.lib.json`), or its `typecheck` target if it has one
- `yarn nx test <project> --detectLeaks=false` when tests exist and code (not just docs) changed

Report failures and stop, unless the user says to open the PR anyway (then mention them in the PR body).

## 3. Title

Format: `type(scope): description`, lowercase, imperative, no trailing period, under ~72 characters.

- `type` must be one of the PR-lint types: `feat infra fix docs style refactor perf test build ci chore revert`.
- `scope` is the app or domain short name used in recent history. Check `git log origin/main --format=%s -- <changed paths> | head` for what that area uses (e.g. `j-s`, `my-pages`, `ids-admin`, `application-system`).

Propose the title and let the user confirm or edit it.

## 4. Body

Fill in `.github/pull_request_template.md`. Keep it short: reviewers know the stack, so don't explain how frameworks work.

```
# <description part of the title>

## What

- <one line per meaningful change, at most ~4>

## Why

<1–2 plain sentences: the problem or motivation. Link the issue if there is one.>

## Screenshots / Gifs

<images for UI changes, otherwise "N/A">

## Checklist:

<the template checklist; tick only boxes that are actually true>
- [x] AI tools were used in preparing this pull request
      Tools used: <the tool you are, e.g. Claude Code>
```

- Don't add AI attribution lines or co-author trailers; the checkbox is the disclosure.
- Mention feature flags, migrations (which the reviewer or deployer runs), or config the reviewer needs to know about in **What**.

## 5. Push and open

1. Push with `git push -u origin HEAD` if the branch has no upstream or has unpushed commits.
2. Run `gh pr create --base main --title "<title>" --body "$(cat <<'BODY' ... BODY)"`, adding `--draft` if requested.
3. Print the PR URL.

Never push to `main` or `release/*`, and never force-push without asking.
