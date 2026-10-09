# Lens: correctness, claim, simplification, conventions

This lens runs on every review. It covers what the application-specific
lenses do not: plain logic bugs, whether the diff matches its claim, cleanup
opportunities, tests, README coverage of business logic, and house
conventions.

## G1. Logic bugs

Read every changed function as a skeptic. Look for these:

- **Comparisons:** a threshold off by one (`>` vs `>=`), and precedence
  traps (`x?.length || 0 > n`).
- **Names that lie:** a predicate whose body contradicts its name (often
  left over from local testing).
- **Rule scope:** a limit applied in aggregate where it applies per unit,
  and a missed enum subtype.
- **Unreachable branches:** a refactor that returns the same result as
  before, or a branch that cannot be reached.
- **Async:** races, missing `await`, and results used before they resolve.
- **Inverted guards and conditions.**
- **Silent drops:** a refactor that removes a hidden input, condition,
  message variant, DTO field or `try`/`catch`, and leaves its consumers
  unchanged.

Severity is high when the bug is reachable and the result is high by
SKILL.md's definition; medium otherwise.

Precedent: #21165, #21083, #21416, #20444, #20676, #21556, #20214, #22072.

### Chesterton's fence: find out why deleted code existed

Before accepting the removal of a guard, condition, `clearOnChange`,
fallback, `catch` or hidden input, find out why it was added:

```
git blame --line-porcelain -L <start>,<end> <base> -- <file> | grep '^summary '
```

Use the removed hunk's old line range. `<base>` is
`$(git merge-base origin/main <ref>)`.

- **If a `fix(...)` commit added the deleted line,** the PR may undo that
  fix. Report it at the severity of the original bug, and cite the fix PR.
  Ask whether the reason still applies.
- **If the reason is unclear,** ask. Do not assert that the deletion is
  wrong.

Apply this to logic deletions only, not to copy, imports or formatting.

## G2. Claim vs diff

Compare the claim (the PR description or commit messages) with the diff.
Report three lists:

- **Done:** what was claimed and is in the diff.
- **Claimed but missing:** what was claimed and is not in the diff, or only
  in part.
- **In the diff but not claimed:** above all shared-library edits (see
  U1 in `ui-shared.md`), behaviour removed in a refactor, migrations, config
  and infra changes, and new endpoints.

An empty or generic claim is itself a note. The author wrote the claim, so
judge the code, not the prose.

Then report two things:

- **Verification:** what the author says they ran. Check for:

  - tests;
  - a run on dev with a named test user (gervimaður);
  - screenshots for UI changes.

  "Tested locally" with no flow named is a note, not a finding.

- **Size:** over about 1.000 changed lines, or a feature mixed with a
  refactor, add a one-line FYI suggesting a split. Shared-code edits are
  U1's to judge, so don't repeat them here.
  This is an FYI, never a blocker: the team routinely
  defers splits (Suppressions L).

## G3. Simplification and reuse

- **Existing helpers:**
  - `@island.is/application/core`: `getValueViaPath`, `YES`/`NO`, `hasYes`.
  - `@island.is/shared/utils`.
  - The template's own utils.
  - The shared builders.
- **Duplication:** logic duplicated across files, or across the template and
  its API module.
- **Readability:**
  - Long inline functions in `condition`, `options`, `defaultValue` or
    overview `items`; move them to utils, with conditions in
    `conditionUtils.ts`.
  - If/else nested three or more levels deep; use early returns.
- **Constants:** magic numbers and dates with no named constant.
- **Types:** `string | number` answer types, and types that mirror a
  generated client DTO by hand.
- **Bolted-on conditionals:** a new `if` on a template or product flag
  threaded into a shared or unrelated path. Push it into its own helper or
  condition.
- **Relocated complexity:** a refactor that moves logic without reducing
  the number of ideas a reader must keep in mind.
- **Orphans:** exports, helpers, messages or providers that the change left
  unused. List them and ask before suggesting deletion.
- **Concrete signals:**

  - nested ternaries carrying business logic;
  - boolean flag parameters (`doThing(true, false)`);
  - generic names (`data`, `result`, `temp`) for domain values;
  - a function name that hides a mutation (`get…` that writes).

  Skip what ESLint or Prettier already enforce. Type assertions are D9's.

**Calibration.** Suggest a simplification only when a new team member would
understand the result faster. Leave these alone:

- **Line count:** never suggest a change only to make code shorter.
- **Named helpers:** never inline a helper that names a domain concept.
- **Merging:** never merge two simple functions into one complex one.
- **Matching neighbours:** never suggest a style the surrounding code
  doesn't use. Consistency with neighbouring code wins.

Every finding here names the **remedy**, not just the problem:

- replace a conditional chain with a map or dispatcher;
- collapse duplicate branches;
- move feature logic into the template that owns it;
- reuse the canonical helper;
- delete a pass-through wrapper;
- extract a helper.

Choose the remedy that leaves fewer parts to maintain.

Severity is low. Report it as a suggestion.

## G4. Code-smell baseline

These are judgement calls, never violations. Label each "possible …". Where
a documented repo rule endorses the pattern, the rule wins.

- **Mysterious Name:** a name that hides what the thing does.
- **Duplicated Code.**
- **Feature Envy:** a function that works mainly on another module's data.
- **Data Clumps:** fields that always travel together.
- **Primitive Obsession:** a bare string used where a domain type belongs.
- **Repeated Switches.**
- **Shotgun Surgery:** one change forcing edits in many files.
- **Divergent Change:** one file changing for several reasons.
- **Speculative Generality:** abstraction nobody asked for.
- **Message Chains.**
- **Middle Man:** a layer that only delegates.

Report at most three, and only where the smell is plain in the diff.

## G5. Tests

Read the tests before the implementation. They show what the author thinks
the change does.

- **Fixtures that match reality:** test answers and externalData should be
  shaped as the template actually produces them, through prefill actions,
  defaults and repeater rows. A spec that passes only on a state the app
  never reaches proves nothing.
- **Negative control:** for a guard or condition the change adds, there
  should be a test that would fail without it.
- **Changed expectations under a refactor:** a PR claimed as a refactor,
  chore or "no behaviour change" that edits the assertions or fixtures of
  an **existing** test. It has changed behaviour. Report it as medium and
  ask which behaviour changed on purpose.
- **Fix PRs:** a fix in a state machine, mapper or validator with no
  regression test is a suggestion, not a blocker. The team writes tests for
  non-trivial logic only.
- **Mutation check (on request only):** when the user asks for one, and the
  review runs on the working tree, do this:

  1. invert one added condition;
  2. run that project's spec;
  3. restore the file.

  A mutation that stays green names the missing test. A stale `gen/fetch`
  can make the suite fail for unrelated reasons: regenerate it, don't
  report it.

Severity is low; medium when the untested logic is high-severity by
SKILL.md's definition.

## G6. README holds the business logic and its reasons

Every template's README must explain what the application does and **why**,
so a reader never has to reverse-engineer a rule from the code. Check the
README of each template the diff touches, under
`libs/application/templates/**/README.md`, at the reviewed ref.

1. **List the business rules the diff adds or changes:**
   - eligibility and prerequisites;
   - conditions that show, hide or branch screens;
   - thresholds, limits and date windows;
   - fee, amount and tier calculations;
   - states, transitions, roles and who acts in each;
   - what is sent to the institution, and when;
   - how data-provider failures are handled;
   - lifecycle and pruning.
2. **For each rule, find it in the README.** It must state the rule and its
   reason, such as a law, an institution requirement, or a product decision
   naming who made it. A rule without a reason counts as missing.
3. **Also check that the README carries:**

   - the institution and contact;
   - the state flow;
   - the test users (gervimenn) and what each exercises;
   - the feature flag;
   - a `## Decisions` section. It lists each settled product decision as
     one bullet: the decision, the reason, who decided, and the date
     (`DD.MM.ÁÁÁÁ`). The reviewer reads this section as settled
     (Suppressions M).

   A decision recorded only in a ticket or a PR thread is missing.

   Text that the diff makes false counts as stale: a state that no longer
   exists, an old limit, or old infrastructure.

- **Flag:** each rule missing from the README or given without its reason;
  each stale statement; a new template whose README is the generator stub.
  Quote the rule and the `path:line` that implements it.
- **Severity:** medium. A new template with a stub or missing README is
  also medium, but list every undocumented rule under that one finding.
- **Precedent:** #21890, #23142, #23188, #20523, #20890, #24035.

## G7. House conventions

Severity is low. Batch them into one line each.

- **Folders:**
  - New templates live in `templates/<org>/<app>`. Older flat templates
    are left as they are.
  - `/fields` holds custom `.tsx` only, with one screen per file.
  - `dataSchema.ts` holds zod only.
  - `utils/` holds helpers, constants and types; keep a single utils
    folder.
- **Naming:** messages are imported as `m`; ids and file names are in
  English.
- **Generator leftovers:** unused `stateMachineOptions`, a TODO code owner,
  lorem ipsum, placeholder ids (`'asdf'`), test kennitala. A stub README
  is G6's. Also flag lorem ipsum on an unchanged screen that a new flow in
  the diff now reaches (#22144 replaced the done-screen text #22003's BE
  flow inherited).
- **CODEOWNERS:** a new template or template-api folder has its line, with
  the org-level owner.
- **Deprecated:** `answerValidators` (use zod).
- **Builders:** omit empty `title: ''`, and use a `MultiField` only with
  more than one child.
- **Dependencies:** a new `package.json` dependency where the monorepo
  already has one for the job. Ask what it adds, and check its licence and
  maintenance.

Precedent: #22865, #23188, #23130, #20523, #21890, #23293.
