# form-system

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test form-system` to execute the unit tests via [Jest](https://jestjs.io).

## Running codegen

yarn nx run portals-admin-form-system:codegen/frontend-client

## Field text editors

The base field editor has independent toggles for information text and tooltip
text. Each reveals both language inputs and starts enabled when either language
has non-whitespace content. Clear both languages before switching a toggle off.
These toggles do not add stored field settings.
Message fields always show both information-text language inputs without a toggle.
HTML guidance for `<strong>` and `<em>` appears above information-text inputs
whenever they are visible, including when their toggle is enabled.
Tooltip editing is only available for text, number, checkbox, email, and
national-ID fields. National-ID tooltips appear on the editable national-ID input,
not on the name or address fields populated by the lookup.
Phone-number fields do not support tooltip editing or display.
Applicant fields do not support tooltip editing or display either; saved applicant
tooltips are ignored.
Applicant settings show Icelandic instructions above each name input, with
role-specific examples for both the Icelandic and English section headings.
These headings are not personal or company names.
Email tooltips appear inside the email input, not above it.
Automatic English translations target the originating field and do not overwrite
English edits made while a translation request is pending.
Completed translations save that field's current data even after selection
changes. Results for deleted fields are discarded without updating local state
or saving.
Full-field saves are serialized per field, including automatic translations and
subsequent manual edits, so a delayed translation save cannot overwrite a later
saved edit. Updates to different fields can proceed independently.

## Family settings

Selecting "Barn" shows guidance below the dropdown explaining that it contains children in
the applicant's custody according to the National Registry, not children outside
their custody. This guidance is also visible in read-only mode.
Child fields always display all custody children in a table; there are no
display-mode options or child `isDropdown` setting. Asset and payment-quantity
fields retain their own dropdown settings.
Each table row ends with a checkbox, initially checked. Saved selections are
restored when returning to the screen, including when every child was unchecked.

## Forms list

The forms-list query requests only the ID, Icelandic name, slug, modification
date, status, submission-service URL, accessibility flag, last editor, and source
form ID. The service selects only those columns, without loading form content,
settings, or dependencies. Organization options remain available.
Opening the editor or validating publication still fetches the complete form
on demand.
Status totals for the selected organization's forms appear in a horizontal row
above the "Opna síu" and "Sía eftir leitarorði" controls, using the table's status
tags. Totals include all loaded forms, regardless of the active filters.
Clicking a status tag moves matching forms to the top without hiding other
statuses or changing active filters. Hover and focus use each tag's matching
color (green, blue, or purple), with a visible keyboard-focus outline. Clicking
outside removes the highlight without changing the chosen sort order.
Sorting by name or last-modified date clears the selected priority. The "Staða"
table heading is not sortable; use the status tags above the filters instead.
The "Nýtt" and "Flytja inn" buttons remain on the left.

## Publishing

After a publish request fails, the forms list refreshes from persisted state:
publishing may already have committed before attachment cleanup failed.
If the refresh also fails, the operator is told to reload before retrying.

## Data collection preview

The Gagnaöflun settings offer only "Skoða skjá", including in read-only mode,
without "Skoða með tengingum". The preview opens on the data-collection section.
This button is left-aligned on its own row above the left-aligned Gagnaöflun heading;
other screens retain their existing preview toolbar.
The Staðfesting settings also offer "Skoða skjá" above the heading,
opening the confirmation-screen preview without restrictions.
The Aðilar settings offer the same button above the heading to preview applicants
without restrictions.
Settings screen headings are left-aligned, including submission URLs, lifetime,
and application deadline settings.
Previews opened from settings keep the settings navigation visible behind the
modal, including after it closes.

The preview header has a Farsímasýn toggle. It switches the same preview iframe
between its full width and a 390px mobile viewport without resetting input or
navigation state. The iframe uses the existing form-system-web responsive
breakpoints, grid, footer spacing, and sticky mobile stepper layout. Radio options
use CSS media queries at the existing `lg` breakpoint, so their layout follows
the iframe viewport without changes to island-ui/core.
Opening the preview focuses its header without drawing a focus outline around
the whole header. Interactive controls retain their keyboard-focus styling.
The sticky mobile stepper stays above the form content while scrolling, so the
content cannot cover its center and leave only its background edges visible.
The preview modal is capped at 1200px wide, leaves at least 48px on each side,
and is 144px shorter than the browser height.
The iframe fills the available space without an 800px height cap. The logo,
organization and form name share the header row with the preview controls,
matching form-system-web. Mobile view uses compact, accessibly labelled controls.
