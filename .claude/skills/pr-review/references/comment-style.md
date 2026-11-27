# Writing review comments

How to phrase the comments you draft for the developer to post. Based on the [code review guide](https://docs.devland.is/technical-overview/code-reviews.md) and on how experienced reviewers in this repo actually comment: 199 comments on 34 recent PRs had a median length of about 100 characters, 37% were questions, and fewer than 5% contained code.

The author is a capable developer who knows the stack and their own change better than you do. Write the way a colleague leaves a note, not the way a tutorial explains.

## Shape

- **One point per comment, usually one or two sentences.** Most comments fit on a line. Go longer only when the point needs a scenario to be convincing (see below).
- **Start with the verb that carries the weight** (DOD-5):
  - `Should …` when the code is buggy, dangerous, or a real performance hit: "Should not fetch these unless the feature flag is on."
  - `Consider …` (or a leading `~`) when it's optional, knowledge-sharing, or you don't feel strongly: "~Consider moving this to `utils`, next to `isCancelled`."
  - `Let's …` for a small change you expect the author to agree with: "Let's prefill with the current date."
- **Ask when you might be wrong.** Questions are the most common form, and they leave room for context you don't have:
  - "Is this used?" · "Unrelated?" · "Tested on iOS and Android?" · "Can delete?"
  - "Should this be a hook?" · "Do we need to version this, or are there no outside clients?"
  - "Curious if this is ever `undefined`? I'd expect zustand to merge stored data into the default."
  - "Does this double as an index for lookups by `to_national_id`?"
- **Hedge honestly, not politely.** "I guess", "might", "probably not serious, but…" signal real uncertainty. Don't hedge a confirmed bug.

## What not to do

- **Don't explain how the framework, library, or language works.** No "In React, `useEffect` runs after…", no "Sequelize migrations are…". Name the consequence instead.
- **Don't paste the fix.** No code blocks unless the change is tiny and exact; then use a GitHub ` ```suggestion ` block of a few lines. Pointing at an existing utility beats writing one: "Consider using `utils/deduplicatePromise.ts`, which does the same."
- **Don't restate the diff** ("This function now takes two arguments and…"). The author wrote it.
- **Don't lecture on policy.** "Should use the config module" is enough; don't quote the rule.
- **No praise padding or apologies** around a finding. Praise goes in its own short comment or the summary, and only when it's earned ("Awesome refactor 🎉", "This is so much easier to read").

## When a comment needs more than a line

Bugs that only show up in a sequence of events need the sequence, or the author can't judge them. Then write it as a short trace, still without teaching:

> `poll()` can throw after IDS has already handed out its one-time token, e.g. if the JWKS fetch fails. Since this is outside the `try`/`endStepUp` block, `authReqId` stays set. The next poll gets `invalid_grant` → `expired`, and the grantor sees "timed out" for a login that succeeded.

Rules for these:

- Lead with the concrete failure, then the path to it, then (optionally) one line on a fix.
- Use real names from the code (`authReqId`, `endStepUp`), not abstractions.
- Say how likely it is when that matters: "Unlikely with our generated clients, but…", "Probably not serious: sensitive flags are enforced on the backend."
- Group related points as a short bullet list inside one comment rather than five separate comments.

## What reviewers here look at

These come up again and again; check them before style:

- **Deploy safety:** migrations that break the old pods still running, non-transactional migrations, missing defaults on new non-null columns.
- **Public surface:** internal fields leaking into a public DTO or API, re-exports that confuse imports, breaking changes without versioning.
- **Hot paths and growth:** extra queries per request, indexes that don't match the queries, tables that will grow large or write-heavy.
- **Reuse:** an existing utility, hook, client library, Enhanced Fetch, or `ConfigModule` already does this.
- **Error and empty states:** missing error/no-data handling in UI; custom error handling where the global handler would do.
- **Flags:** data fetched or UI rendered before or without the feature flag.
- **Delegations and identity:** subject vs actor, companies vs persons, keyed on `sub` rather than a kennitala.
- **Unrelated or leftover files:** lockfile churn, TODO/plan files, commented-out code, comments that narrate the change.
- **Tests** for new behaviour, named concretely ("Should add tests for multiple scope handling").
- **Product/UX questions** go to the people who decide: "Let's check with design", "Was there a decision here?"

## Summary comment

One or two lines, matching the verdict: "Approved with minor comments 👍", "Would be good to improve fetch logic and problem handling 🙏". For a big PR, say what's bigger than the PR (architecture, scope) in a few sentences, and leave the specifics inline. Ask for screenshots in the description for UI changes.

## Findings from an agent

When the developer posts a finding you drafted, it's theirs. If they want to mark it as agent-sourced, they do it themselves ("One from the LLM to consider 🤷"); don't add attribution lines.
