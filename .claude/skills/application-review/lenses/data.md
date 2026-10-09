# Lens: answers, schema, repeaters, formats

Severity is high when wrong or missing data reaches an institution, a
submission is blocked, or money is wrong. It is medium otherwise.

## D1. Answer key drift

- **Flag:**
  - A `getValueViaPath(answers, '<path>')` in a mapper, overview, PDF or
    condition names a path that no field `id`, `setValue` key or schema key
    in the template writes. Grep for the writer.
  - A field or schema key is renamed, and template-api-modules or the
    overview still read the old name.
  - An answer is compared to a bare literal (`=== 1`) where the template has
    an enum.
  - An API DTO field the mapper never fills.
  - **Writes outside the field's own id:** a field writing to another key
    (`setValue('other.key')`) that the screen extraction won't save. It
    looks saved and vanishes on reload. This happens when:
    - the field is not a whole-screen custom field with more than one
      `childInputIds`;
    - `childInputIds` are used inside a `buildMultiField`, where they're
      ignored;
    - accordion children sit outside a multiField, or `accordionItems` is
      a function.
  - **A `buildDataProviderItem` `id`** that differs from the provider's
    `externalDataId`. The user is stuck on the provider screen.
- **Why:** keys are untyped strings across four sites in two libraries. A
  mismatch compiles, and the institution gets a blank field.
- **Severity:** high.
- **Precedent:** #21074, #21432, #20399.

## D2. Stale answers

- **Flag:**
  - A select or radio that drives another field's options or condition, with
    no `clearOnChange` or `setOnChange`.
  - A field gaining a `condition` while the schema or mapper still reads it
    unconditionally.
  - A mapper that sends a group under a different predicate from the
    screen's `condition`; reuse the same helper.
  - A `clearOnChange` that clears a path the schema requires.
  - Options taken from externalData frozen at creation, when the list can
    change.
  - An eligibility gate that tests a different field from the one the
    submit path needs. Stricter blocks users who could submit; looser lets
    users pay and then fail. Compare what submit **requires** (throws on, or
    sends) with what the gate tests. A field submit reads only to log does
    not count. Gating on an optional payload, such as an image binary,
    where the record's id would do, is the usual stricter case.
- **Why:** answers never delete (see framework-rules), so hidden values are
  validated, which blocks submit, or sent, which delivers wrong data.
- **Severity:** high.
- **Precedent:** #23495, #23716, #20891, #20392, #22548.

## D3. `clearOnChange` on non-string fields

- **Flag:** `clearOnChange` targeting a number, boolean, enum, object or
  array field without `clearOnChangeDefaultValue`. Also flag a
  `buildHiddenInput` with no default that zod then requires.
- **Why:** it writes `''`, so `z.number()`, `z.nativeEnum()`, array and
  object schemas, and option filtering fail. Any unfiltered screen later in
  the form surfaces that error invisibly (see framework-rules: single-field,
  repeater child, provider and id-less multiField screens).
- **Severity:** high when the schema rejects `''` and an unfiltered screen
  follows the clear, because submit is blocked. Medium otherwise.
- **Precedent:** #23716, #21177, #20540, #20393.

## D4. Repeater rows

- **Flag:**
  - Totals, duplicate checks, `superRefine` or mappers that iterate a
    repeater answer without `!row.isRemoved`.
  - Code that assumes no `{}` rows.
  - A row schema without `isRemoved`.
  - Nested repeater callbacks using the wrong index variable.
  - **Clearing a row key by omitting it, or reordering rows of equal
    length.** Arrays of objects deep-merge by index, so the old key
    survives and reordered rows mix.
- **Why:** the stored array is not the visible one.
- **Severity:** high.
- **Precedent:** #23791, #21429, #22014, #20735.

## D5. dataSchema too loose

- **Flag:**
  - A new template without the prerequisites refine
    (`approveExternalData: z.boolean().refine((v) => v)`, or whatever key
    the checkbox writes).
  - Every array or object in a submit section `.optional()`, with nothing
    requiring an entry.
  - A required id made optional or defaulted.
  - A schema shape that the form's output never matches.
- **Why:** a schema that does not require consent or an entry lets an empty
  application through.
- **Severity:** high.
- **Precedent:** #22111, #22118, #22865, #21672.

## D6. dataSchema too tight

- **Flag:**
  - A refine against `new Date()` or "today".
  - A validator tightened where edit or approved states re-validate old
    answers.
  - `z.string()` receiving a numeric API id.
  - `parseInt` or `> 0` checks on decimal input.
  - A root-level refine (it disables `.partial()`).
  - Units inconsistent across sibling schemas (percent vs ratio).
- **Why:** the client validates every answer it holds on Continue, and
  SUBMIT sends them all to the server, which validates them again. A
  tightened rule therefore judges old answers in live and approved
  applications too, and locks them out.
- **Severity:** high.
- **Precedent:** #22271, #21778, #22063, #21826.

## D7. Value format and constants

- **Flag:**
  - Core `YES`/`NO` mixed with a template's own `'Yes'`.
  - A Yes/No answer that is truth-tested.
  - A string literal used instead of `YES`/`NO`.
  - An encoded select value (`<id>::<option>`) compared to an enum.
  - Codes matched against a translated label.
  - `x ?? default` where `x` can be `''`.
  - A truthiness test on a number that can be 0.
  - `null` joined into a compound value.
- **Severity:** high when it steers what is sent or charged; medium
  otherwise.
- **Precedent:** #22977, #20729, #21143, #20543, #23429.

## D8. Money, numbers and dates in payloads

- **Flag:**
  - A regex that strips the minus sign (`[^\d.]`).
  - `parseInt` on money.
  - Unrounded floats sent to an institution.
  - Icelandic decimal commas not handled.
  - A `Date` or `toISOString().substring` where the API wants another
    format.
  - `new Date(x || '')`.
  - `application.created` standing in for the submission date.
  - A fallback that picks `applicantActors[0]` over the applicant.
  - A fee or tier formula duplicated in the template and the API module.
- **Severity:** high.
- **Precedent:** #21280, #20313, #22230, #22588, #21569.

## D9. Typed access

- **Flag:** `as` on `answers`, `externalData` or a `getValueViaPath` result,
  and `as unknown as`. The house idiom is `getValueViaPath<T>(…) ?? fallback`, `useWatch<T>`, or the template's `getApplicationAnswers()`.
- **Why:** `as` hides `undefined`.
- **Severity:** medium.
- **Precedent:** #23130, #22501, #20868, #20872.

## D10. Unguarded external shapes

- **Flag:**
  - `[0]`, `.find(...)!` or a long chain on provider, API or GraphQL data
    with no guard.
  - `?.[0].x`, where the chain stops early.
  - A prerequisites provider that throws on a legitimate "not found" or a
    legacy record.
  - A branch that reads provider data it never fetched.
- **Severity:** high when it crashes submit or blocks eligible users;
  medium otherwise.
- **Precedent:** #21672, #21042, #23774, #23749, #20798.
- **Limit:** apply Suppressions A first.
