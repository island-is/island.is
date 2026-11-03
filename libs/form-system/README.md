# form-system

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test form-system` to execute the unit tests via [Jest](https://jestjs.io).

## Moving Forms Between Environments

In the admin portal, use **Export form** in the form row's action menu to download
a versioned JSON definition. In the destination environment, select the target
organization and use **Import form** beside **New** to upload that file.

An import always creates a new unpublished draft, never updates an existing form,
and regenerates database IDs while preserving field and screen identifiers and
remapping dependencies. The original slug is retained if available; otherwise a
unique suffix is added. Forms without a slug receive a generated slug.

The file includes the form configuration, sections, screens, fields, list items,
and certification selections. It does not include applications, submitted values,
uploaded files, or organization-level settings and permissions. Certification
types must be available to the destination organization. The importer must have
access to that organization (or be a form-system administrator).

Review submission URLs, validation URLs, payment settings, delegations, and
Zendesk IDs in the imported draft before publishing: these settings are preserved
and may need different values in production. Export files may contain internal
configuration and should be handled accordingly.
