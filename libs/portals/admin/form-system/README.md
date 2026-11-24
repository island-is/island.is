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
Email tooltips appear inside the email input, not above it.
