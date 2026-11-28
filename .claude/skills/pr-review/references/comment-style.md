# Writing review comments

How to phrase the comments you draft for the developer to post. Based on the [code review guide](https://docs.devland.is/technical-overview/code-reviews.md) and on how experienced reviewers in this repo actually comment: a typical comment is around a hundred characters, about a third are questions, and very few contain code.

The author is a capable developer who knows the stack and their own change better than you do. Write the way a colleague leaves a note, not the way a tutorial explains.

## Shape

- **One point per comment, usually one or two sentences.** Most comments fit on a line. Go longer only when the point needs a scenario to be convincing (see below).
- **Start with the verb that carries the weight** (DOD-5):
  - `Should …` when the code is buggy, dangerous, or a real performance hit: "Should only load this once the flag is known to be on."
  - `Consider …` (or a leading `~`) when it's optional, knowledge-sharing, or you don't feel strongly: "~Consider moving this next to the other date helpers."
  - `Let's …` for a small change you expect the author to agree with: "Let's default this to the signed-in user."
- **Ask when you might be wrong.** Questions are the most common form, and they leave room for context you don't have:
  - "Is this used?" · "Unrelated?" · "Tested on iOS and Android?" · "Can delete?"
  - "Should this live in a hook?" · "Does anything outside our apps call this, or can we change it freely?"
  - "Can this ever be `undefined` here? I'd expect the default to cover it."
  - "Does the unique constraint also cover this lookup, or does it need its own index?"
- **Hedge honestly, not politely.** "I guess", "might", "probably not serious, but…" signal real uncertainty. Don't hedge a confirmed bug.

## What not to do

- **Don't explain how the framework, library, or language works.** No "In React, `useEffect` runs after…", no "Sequelize migrations are…". Name the consequence instead.
- **Don't paste the fix.** No code blocks unless the change is tiny and exact; then use a GitHub ` ```suggestion ` block of a few lines. Pointing at an existing utility beats writing one: "Consider the existing helper in `utils/`, which does the same."
- **Don't restate the diff** ("This function now takes two arguments and…"). The author wrote it.
- **Don't lecture on policy.** "Should use the config module" is enough; don't quote the rule.
- **No praise padding or apologies** around a finding. Praise goes in its own short comment or the summary, and only when it's earned ("Awesome refactor 🎉", "This is so much easier to read").

## When a comment needs more than a line

Bugs that only show up in a sequence of events need the sequence, or the author can't judge them. Then write it as a short trace, still without teaching:

> `save()` can throw after the payment provider has already charged the card, e.g. if the receipt lookup fails. Since this is outside the `try`/`markPaid` block, `pendingId` stays set. The next retry gets `already_processed` → `failed`, and the user sees "payment failed" for a payment that went through.

Rules for these:

- Lead with the concrete failure, then the path to it, then (optionally) one line on a fix.
- Use real names from the code (`pendingId`, `markPaid`), not abstractions.
- Say how likely it is when that matters: "Unlikely with our generated clients, but…", "Probably harmless, since the backend checks this too."
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
- **Tests** for new behaviour, named concretely ("Should add a test for the multi-select case").
- **What the user sees:** limits, error cases and orderings the change introduces. Ask about them as questions; the answer is often a product decision ("Was there a decision here?", "Let's check with design").

## Summary comment

One or two lines, matching the verdict: "Approved with a couple of small comments 👍", "Would be good to tighten the error handling before merge 🙏". For a big PR, say what's bigger than the PR (architecture, scope) in a few sentences, and leave the specifics inline. Ask for screenshots in the description for UI changes.

## Findings from an agent

When the developer posts a finding you drafted, it's theirs. If they want to mark it as agent-sourced, they do it themselves (e.g. "From an AI review, worth a look"); don't add attribution lines.
