# Calculator Renderer UI Issues

Open UI follow-ups from the current metadata-renderer pass.

## 1. Required Field Indicator

Required fields from calculator metadata are not visually marked.

Expected:

- fields with `required: true` show the standard required marker, likely `*`
- the marker should come from metadata, not Contentful config
- optional fields remain unmarked

## 2. Regular Text Size

Regular body/help text in the calculator surface reads too large relative to the
field density.

Expected:

- section descriptions and supporting text should use a smaller regular text
  variant
- section headings should remain prominent
- field labels and values should stay readable inside compact controls

## 3. Responsive Column Sizing

Configured column spans can produce too many narrow controls in one row, causing
select values and long labels to truncate.

Expected:

- controls should reduce the number of columns when available width is tight
- long select values should not be clipped unnecessarily
- long labels should wrap cleanly inside controls
- authored `span` should still be respected when there is enough room

## 4. Field-Level Markdown Content

Markdown explanatory content is currently modeled at section level, not field
level. That does not work for help text that belongs to one specific control.

Current reason:

- the shared config schema has `outputSections[].content` as markdown
- input sections only have `description` as localized plain text
- input/output fields only have labels/placeholders, not markdown content

Expected:

- support field-level markdown/help content when copy belongs to a specific
  control
- keep section-level markdown for copy that introduces or explains a whole
  group
- this likely requires a shared schema/editor update, not only a web renderer
  change

## 5. Output Field Dropdown Density

The Contentful output field dropdown currently shows key, data type, and
semantic. That is visually overwhelming when authors are choosing fields.

Expected:

- output field dropdown options should show only the field name/key
- array item field dropdowns should follow the same simplified display
- stale-key warnings can still include explanatory text
- type/semantic details can remain available elsewhere if needed, but should
  not dominate the option labels

## 6. Field Label/Value Emphasis

Field controls need clearer visual hierarchy. Either the label, the value, or
both should be bold enough to scan quickly.

Expected:

- choose a consistent emphasis rule for compact calculator controls
- make key entered/selected values easy to scan
- preserve readability for long labels and narrow columns

## 7. Input/Output Terminology And Output Hero

The editor labels "Input sections" and "Output sections" are misleading. The
tabs are not just browsing section lists; they switch between configuring the
input part of the calculator form and the output/result part of the calculator.

Expected:

- rename editor tabs to describe the calculator parts, not only sections
- input configuration can still contain multiple input sections
- output configuration needs a top-level result/hero area, not only fields
  inside output sections
- the output hero should support a title and a value to display prominently
- output sections should remain for secondary breakdowns/details, not replace
  the primary result display

Current gap:

- the shared config models `outputSections[].fields`
- there is no first-class top-level output hero/result field
- modeling the hero as just another field inside a section makes the primary
  result feel like secondary section content

## 8. Per-Value Extra Spacing Toggle

Each displayed value should have a simple spacing toggle alongside the
bold/emphasis option.

Expected:

- add a per-value `extraSpacing` toggle near the bold/emphasis control
- normal spacing between fields is 8px, equivalent to design-system spacing
  unit 1
- when enabled, add 16px of additional spacing, equivalent to design-system
  spacing unit 2
- keep it binary: on or off
- use it to create breathing room around important values without fake sections,
  empty content, or custom layout blocks

Current gap:

- fields can be marked as emphasized/bold, but spacing around individual values
  cannot be controlled
- renderer spacing is fixed, so authored result layouts cannot match designs
  that need slightly larger gaps between value groups
