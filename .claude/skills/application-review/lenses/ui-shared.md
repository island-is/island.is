# Lens: blast radius, fields, i18n, builders

Severity is high when other templates break, a user is stuck, answers are
lost, or a file reaches an institution unchecked. It is medium otherwise.

## U1. Blast radius

- **Flag:** a change to any of the shared code below.

  - **Shared code:**
    - `ui-shell` (FormShell, reducer, Screen)
    - `ui-fields`, `ui-components` or `ui-forms`
    - `core` or `types`
    - `template-loader`
    - `template-api-modules/src/lib/modules/shared`
    - the national registry or payment services
    - `libs/application/graphql` (the form's Apollo client)
    - `libs/api/domains/application` (the gateway, which also serves
      form-system cards and the admin)
    - `libs/cms-translations`
    - `InstitutionMapper.ts` and `Institution.ts`, which form-system joins
      by key name
    - a renamed `slug`, which breaks links
    - anything else in the "Shared files touched" list from routing
      (`libs/shared/**`, `libs/island-ui/**`, `libs/localization`,
      `libs/clients/middlewares`, `libs/application/utils` and
      `libs/application/api`)
  - **What to do:** for every file in "Shared files touched", and for each
    exported symbol whose behaviour, props or signature changed, run:

    ```
    .claude/skills/application-review/scripts/consumers.sh <file> <symbol> <ref>
    ```

    `<ref>` is the reviewed ref. It prints the library, its import alias,
    and the number of consuming files per template or app, across the whole
    repo, portals and apps/web included.

    1. Open the consumers that use the changed behaviour: the prop, default
       or branch that changed.
    2. Name those whose behaviour shifts. Ask that they be checked, and
       give the count.

    If the script prints no alias, it falls back to listing the files that
    reference the changed file by path. That covers a config-wired stub or
    a library new in this PR.

    **Runtime framework code is the exception.** Import counts understate
    its reach. This covers `ui-shell`, `core`, `types`, `template-loader`,
    `libs/application/api/**`, and ui-fields components that are rendered
    by field type rather than imported. Every template runs through this
    code, even though the script may show one consumer, such as
    `apps/application-system/form`. For these:

    1. Name the builder option, prop, field type or behaviour that
       changed.
    2. Find the templates that use it:
       `git grep -l "<option or prop>" <ref> -- libs/application/templates libs/application/template-api-modules`.
       Examples are `renderLastScreenButton`, `clearOnChange` and
       `FieldTypes.TABLE_REPEATER`.
    3. Those templates are the blast radius. When the change alters a
       default, every template that omits the option is affected too.

  - **Signatures:** flag any changed signature, prop shape, screen-count
    semantics or default.
  - **Single-template PRs:** a feature PR for one template whose shared
    edits change behaviour for others is itself a finding (medium). Ask
    for the change to be split out and described. Additive shared code,
    such as a new option or a new field type nothing else uses yet, is
    only noted.
  - **Feature logic in shared code:** a shared component or service that
    gains a branch for one template or product. Such logic belongs in that
    template, behind a prop, a builder option or a callback.

- **Severity:** high when a named template breaks; medium when the impact is
  unverified.
- **Precedent:** #21890, #23003, #23059, #23050, #20422, #20594.

## U2. Shared field side effects

- **Flag:**
  - A shared field that hardcodes a `setOnChange` or clear path.
  - Shell state (`setSubmitButtonDisabled`, loading) set without a reset on
    unmount.
  - FieldsRepeater and TableRepeater diverging.
  - A new shared option with no case in `examples/example-inputs`.
  - Min, max or edge flags handled asymmetrically.
- **Severity:** medium; high when answers on other screens are overwritten.
- **Precedent:** #22964, #23503, #21536, #21543.

## U3. Custom-field contract

- **Flag:**
  - Async work in a field that does not disable the footer.
  - `methods.reset` called inside a field (it wipes other answers).
  - `useState('')` where the value should come from `getValues(id)` (it is
    lost on back-navigation).
  - `debounce` created in render.
  - Effects that depend on objects rebuilt each render, or that set the
    value they watch. One that also calls `setValue` re-renders itself
    forever: the screen freezes, so it is high (#20476 ← #14355).
  - An added `eslint-disable react-hooks/exhaustive-deps`.
  - A lookup error that clears a prefilled value.
  - A container that renders children without evaluating `condition`.
  - Display-only builders without `doesNotRequireAnswer`.
  - Enter in a custom input submitting the screen.
  - A parent key stored both as a scalar and as an object.
  - Fields writing outside their own id (`childInputIds` and the rest):
    see D1, which owns that rule.
  - **`setBeforeSubmitCallback` without `{ allowMultiple, customCallbackId }`.**
    It replaces every other field's callback on the screen.
  - **A direct `UPDATE_APPLICATION` without `draftProgress`.** Progress
    resets to 0.
  - **A template custom component named like a ui-fields component.** It
    shadows the shared one.
  - **Live conditions:** a section, subsection or single-field-screen
    `condition` that depends on input on the same screen. Only multiField
    children react live; the rest update after Continue.
  - **Submit actions:**
    - A lone conditional submit action.
    - Conditional actions with `placement: 'screen'`.
    - A destructive action (REJECT, ABORT) listed first. Enter triggers
      it.
  - **Navigation:**
    - A `backId` that names no screen id, a function id, a repeater child
      or a hidden screen. It silently does nothing.
    - A submit screen that can become the last screen without
      `renderLastScreenButton`. The buttons vanish.
- **Severity:** high when answers are lost or the user is stuck; medium
  otherwise.
- **Precedent:** #22891, #21124, #20635, #20324, #22503, #20971, #23634, #22290, #22118.

## U4. Custom component where a builder exists

- **Flag:** a `buildCustomField` that reimplements any of these:

  - a table or fields repeater
  - an accordion
  - an overview
  - applicant info (`applicantInformationMultiField`)
  - an image or a link
  - a static table
  - file upload

  Also flag a custom field that fetches by GraphQL what externalData already
  holds, and custom validation that zod `superRefine` could do.

- **Severity:** high for file upload, where `buildFileUploadField` must be
  used; medium otherwise.
- **Precedent:** #23188, #23160, #23130, #20868, #21017.

## U5. i18n wiring

- **Flag:**
  - An `ApplicationConfigurations` `translation` namespace that disagrees
    with the `defineMessages` id prefix. Look for a prefix missing its org
    part (`dub.ub` vs `vmst.dub`), and for a namespace shared with another
    application.
  - `uiForms.application` missing when ui-forms are used.
  - A namespace added only to the template's `translationNamespaces`. The
    client loads only `ApplicationConfigurations[type].translation`.
  - Messages not wrapped in `defineMessages`.
  - An `extract-strings` path that misses the messages file.
  - Ids copied with another template's prefix, or a duplicated segment.
  - `{placeholders}` with no values passed.
  - A descriptor rendered without `formatMessage`.
  - A locale-blind `name` where the API offers `english`.
  - Markdown messages without the `#markdown` id suffix and double newlines.
- **Severity:** medium; raw keys are shown to users.
- **Precedent:** #23879, #21599, #20325, #22864, #23293, #21375, #20238, #21219, #21168.

## U6. `defaultMessage` edited

- **Flag:** an edited `defaultMessage` on an existing id. Ask whether
  Contentful was updated; once uploaded, the default is only a fallback.
  Also flag copy that states a rule the code does not implement.
- **Severity:** low.
- **Precedent:** #23253, #23537, #22299.

## U7. Form chrome and stepper

- **Flag:**
  - **Form setup:**
    - A `buildForm` without a `logo` from
      `@island.is/application/assets/institution-logos`.
    - A form with neither a `title` nor a `tabTitle`.
    - A template-local logo asset.
    - A generator-default template `name`.
  - **Stepper:**
    - Fake steps (`buildSection` with `children: []`) and empty sections.
    - Prerequisites, completed or notAllowed forms with more than one
      screen or a stepper.
    - Hidden-input "bridge" screens where `renderLastScreenButton` fits.
- **Severity:** low; medium when the user is left without a button.
- **Precedent:** #23142, #23130, #22111, #23192, #23956, #23487.

## U8. Accessibility

Ísland.is must be usable by blind, partially sighted and dyslexic users,
people with a motor impairment or another disability, older users who
cannot work a mouse, and people who drive the page by voice, head mouse or
other devices that imitate the keyboard. Each check below serves one or
more of them. Apply WCAG 2.2 AA as the yardstick.

Find the candidates by piping the diff through this:

```
<diff> | awk '/^diff --git/{f=$4} /^\+/{print f"\t"$0}' \
 | grep -E $'^b/[^\t]*(\\.tsx|\\.css\\.ts|/forms/|/fields/|libs/application/ui-|libs/application/core/src/lib/fieldBuilders)' \
 | grep -vE $'^b/[^\t]*(\\.spec\\.|\\.stories\\.|mock|Mock)' \
 | grep -E "<(div|span|Box)\b[^>]*onClick|role=\"(radio|button|checkbox|switch|tab|option)\"|<img\b|\balt(=|:)\s*(\{?['\"]{2}|\{?\`\`)|outline:\s*['\"]?(none|0)|tabIndex=\{?[1-9]|aria-hidden|onMouse(Over|Enter)|text-?[Aa]lign:\s*['\"]justify|textTransform:\s*['\"]uppercase|(width|height|minWidth|minHeight):\s*['\"]?([0-9]|[1-3][0-9]|4[0-3])(px)?['\"]?\s*,|setTimeout"
```

The grep finds candidates, not findings. It misses props split across
lines, so also read the changed controls themselves.

- **Operable by keyboard alone.** Serves motor impairment, older users, and
  anyone on a switch, head mouse or voice control.
  - **Flag:**
    - a click handler on a `div`, `span` or a `Box` with no
      `component="button"` or `"a"`; it takes no focus and ignores Enter
      and Space;
    - a custom radio group, select, slider or scale built from such
      elements, without arrow-key support;
    - `tabIndex` above 0, which breaks the tab order;
    - an action reachable only on hover or by drag, or a gesture with no
      single-click alternative;
    - a modal or drawer that does not trap focus while open, or that does
      not return it on close.
  - **Severity:** high when a user cannot complete or submit the form;
    medium otherwise.
- **Focus is visible and moves sensibly.** Serves keyboard and low-vision
  users.
  - **Flag:**
    - `outline: none` with no replacement style;
    - a step change, validation failure or loaded section that leaves
      focus where it was, or drops it to the top of the page;
    - content that appears above the focused control and pushes it out of
      view.
- **Name, role and state are exposed.** Serves screen-reader users, and
  voice users, who say the name they see.
  - **Flag:**
    - an icon-only button or link with no accessible name;
    - an accessible name that does not contain the visible text. A user who
      says "click Senda" must reach the button labelled "Senda";
    - an input with no associated label, or `placeholder` standing in for
      one;
    - a custom control with no `role` and no state (`aria-checked`,
      `aria-expanded`, `aria-invalid`);
    - `aria-hidden` on something focusable;
    - a link that says only "Hér" or "Nánar".
  - **Severity:** medium; high when the control cannot be used at all.
- **Images carry the right `alt`.** Serves blind and partially sighted
  users.
  - **Flag:**
    - an empty `alt` on an image that conveys information, or a missing
      `alt`;
    - a filename or "mynd" as the `alt`;
    - a non-empty `alt` on a purely decorative illustration, which makes a
      screen reader read noise.
  - **Leave alone:** an empty `alt` on a decorative illustration beside
    text that says the same (#21890).
- **Changes are announced.** Serves screen-reader users.
  - **Flag:**
    - an error, success or loading message inserted into the page with no
      `role="alert"`, `role="status"` or `aria-live`;
    - an error shown only in red, or only beside the field, and not tied to
      it with `aria-describedby`;
    - a heading level skipped, or a heading chosen for its size.
- **Colour, size and spacing.** Serves partially sighted users.
  - **Flag:**
    - meaning conveyed by colour alone (a red border with no text, a
      status dot with no label);
    - text smaller than the base size, or set in fixed pixels so that it
      will not scale;
    - a fixed height or width that clips text when it is enlarged to 200%
      or when the line wraps;
    - low-contrast text or controls. Label it "possible contrast problem"
      unless the colours are in the diff and you can compute the ratio:
      4,5:1 for text, 3:1 for large text and control borders.
- **Reading and understanding.** Serves dyslexic users and those with a
  cognitive disability.
  - **Flag:**
    - justified text, text in capitals, or long unbroken paragraphs;
    - an error that says what is wrong but not how to fix it;
    - a timeout or auto-dismissing message (`setTimeout`) that the user
      cannot extend or reread;
    - a destructive or irreversible action with no confirmation;
    - an instruction that relies on shape, position or sound ("the button
      on the right").
  - **Severity:** low; medium when it blocks the task.
- **Touch targets.** Serves motor impairment and older users.
  - **Flag:** a target below 44 × 44 px, or two targets with too little
    space between them.
  - **Leave alone:** an inline link inside a sentence.

The reviewer cannot run the page. When a check needs a browser, screen
reader or contrast tool, say so in an FYI bullet, so the author can run it.

- **Severity:** medium unless a check above says otherwise.
- **Precedent:** #23267 (scale items rendered as `div`s, unreachable by
  keyboard and unusable as a radio group), #21890 (a reviewer asked whether
  an empty `alt` left screen-reader users out; it is correct on a decorative
  illustration).

## U9. No hardcoded user-facing strings

Every string a user can see or hear comes from a `defineMessages` entry,
rendered through `formatMessage` or `formatText`. This covers templates,
custom fields and the shared ui libraries alike.

Find the candidates by piping the diff (from `gh pr diff` or `git diff`)
through this:

```
L='A-Za-zÁÐÉÍÓÚÝÞÆÖáðéíóúýþæö'
<diff> | awk '/^diff --git/{f=$4} /^\+/{print f"\t"$0}' \
 | grep -E $'^b/[^\t]*(\\.tsx|/forms/|/fields/|libs/application/ui-|libs/application/core/src/lib/fieldBuilders)' \
 | grep -vE $'^b/[^\t]*(\\.spec\\.|\\.stories\\.|messages|mock|Mock|/examples/)' \
 | grep -E ">[^<>{}]*[$L]{2,}[^<>{}]*<|(title|label|description|placeholder|alt|aria-label|ariaLabel|header|tooltip|message|text|subLabel|summary|tabTitle)\s*[:=]\s*\[?\s*['\"\`][^'\"\`]*[$L]{2,}|(\?\?|\|\||\?|\s:)\s*['\"][^'\"]*[$L]{2,}[^'\"]*['\"]\s*[,)}]?\s*$"
```

The grep finds candidates, not findings. Read each hit, and also scan the
changed frontend files for literals the patterns miss.

- **Flag:**

  - JSX text;
  - string props and builder fields (`title`, `label`, `description`,
    `placeholder`, `alt`, `aria-label`, `tooltip`, table headers, option
    labels);
  - user-visible template literals;
  - units and currency (`'kr.'`), and "Já"/"Nei";
  - fallback copy such as `?? 'Óþekkt'`.

  Accessible names count too (`alt`, `aria-label`). So do error text and
  status text the browser shows.

- **Leave alone:**
  - ids, keys, `dataTestId`, class names and CSS;
  - enum and answer values;
  - URLs and routes;
  - log and `console` text;
  - `defaultMessage` inside `messages.ts`;
  - values from APIs or answers (names, addresses), which are data, not
    copy;
  - number and date format patterns;
  - spec, story and mock files.
- **Severity:** medium. English users see Icelandic, screen readers read
  untranslatable text, and Contentful cannot edit the copy.
- **Precedent:** #20238, #20656, #20523, #21219.
