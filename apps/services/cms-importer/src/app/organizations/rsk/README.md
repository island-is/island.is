# RSK Double Taxation Treaties Import

Scrapes treaty tables from Skatturinn, resolves document links, and creates
bilingual generic list items with document-type tags. Simple items use localized
asset or external-link fields; items with multiple documents use rich-text links.
Existing slugs are skipped. Entries and uploaded assets are created as drafts.

This import is disabled pending testing. It has no Nx target or CLI route.
The implementation remains in `jobs/treaties/` for future validation.
