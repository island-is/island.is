# application-review

A code-review skill for the application system (`libs/application/**` and
`apps/application-system/**`). It checks a change against concerns
specific to this system, and adds a general correctness pass. Findings are
printed in the terminal. Nothing is posted to GitHub.

The skill runs only when you invoke it.

## Use

```
/application-review 12345        # a pull request
/application-review my-branch    # a branch, compared with origin/main
/application-review              # the working tree, committed and not
```

Add `--mutate` to the working-tree form to check that the tests would catch
a broken condition: the general lens inverts one added condition, runs that
project's spec, and restores the file. A mutation that stays green points to
a missing test.

It needs `git` with an `origin` remote and an authenticated `gh`. For a PR it
fetches the head into a temporary local branch, `review-<number>`, and deletes
it at the end.

### Tell it what is already decided

The reviewer treats the PR description as the author's claim to test, not as a
specification. It cannot know a product decision that is written nowhere in
the repo, so it may question one. Record settled decisions in the template's
README under `## Decisions`, one bullet each: the decision, the reason, who
decided, and the date (`DD.MM.ÁÁÁÁ`). The reviewer reads that section and
does not re-argue what it lists. You can also state a decision in the request.

## How it works

1. **Pin the target.** Take the diff, the author's claim, and the decisions.
2. **Route.** Pick the lenses that apply from the files and lines the diff
   touches.
3. **Dispatch.** Each lens runs as its own subagent, in parallel. A diff under
   about 200 changed lines goes to a single agent.
4. **Verify.** The main agent reads the cited lines of every finding, and
   keeps, drops or marks each one unverified.
5. **Report.** Findings are grouped by severity, with the scenario and a fix
   for each, plus what was checked and found clean.

The lenses are in `lenses/`:

| Lens           | Covers                                                             |
| -------------- | ------------------------------------------------------------------ |
| `data`         | answers, schema, repeaters, formats sent to institutions           |
| `state-access` | states, roles, payment state, readiness, lifecycle                 |
| `template-api` | the submit path, errors, logging, integrations                     |
| `ui-shared`    | shared code and its consumers, fields, translations, accessibility |
| `scopes`       | identity-server scopes and client grants                           |
| `security`     | ownership, data exposure, injection, uploads                       |
| `general`      | correctness, claim against diff, simplification, tests, README     |

The other files:

- `SKILL.md`: the process the agent follows.
- `framework-rules.md`: how the application system behaves. Every lens reads
  it first.
- `suppressions.md`: what not to flag, and why.
- `scripts/consumers.sh`: lists the templates and apps that use a changed
  shared file.

## What it is based on

The checks are based on the history of application-system pull requests:
their review threads and the fixes that followed. Each check cites the PRs it
comes from.

### Inspiration

- Claude Code's built-in `/code-review`, for the general quality pass.
- [Matt Pocock's skills](https://github.com/mattpocock/skills) (MIT,
  © 2026 Matt Pocock): the code-review skill, which runs separate review
  passes as parallel subagents and then aggregates them; and the guide to
  writing agent skills, which shaped how `SKILL.md` is structured, in steps
  with a stated completion criterion and reference material in separate files.
- [Addy Osmani's agent-skills](https://github.com/addyosmani/agent-skills)
  (MIT, © 2025 Addy Osmani): `code-review-and-quality` (multi-axis review,
  change sizing), `code-simplification` (when and how to simplify), and
  `security-and-hardening` (threat model first).
- The smell names in the general lens follow Martin Fowler's catalogue.

Ideas were taken from these sources. No text was copied.

## Keeping it current

- Add a check only with a pull request that shows the problem, and give it one
  owner: no two lenses check the same thing.
- A rule in `framework-rules.md` states how the system behaves, with a
  `file:line`. Re-check the line when the code moves.
- Try a new or changed check on a past PR before keeping it. Keep it only if
  it finds real problems without adding noise.

## Limits

- It reads code. It does not run the application, and runs tests only with
  `--mutate`.
- A finding is a lead for a person to confirm. The verify step reduces noise
  and does not remove it.
- It knows nothing that the repo does not record, which is why `## Decisions`
  matters.
- Accessibility checks (`ui-shared`, U8) run only when a `.tsx` file, a
  `forms/` or `fields/` file, or a shared file changes. A change confined to
  a template's `.css.ts` file does not trigger them. Form-system code gets
  the general lens only, so U8 does not apply there. Contrast, screen-reader
  and focus behaviour need a browser; the reviewer can only point them out.
