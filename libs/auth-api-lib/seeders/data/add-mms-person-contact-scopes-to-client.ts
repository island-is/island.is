import { addScopesToClient, compose } from './helpers'

// Grants the API client the MMS scopes for the caller's own email and phone on
// the Frigg form-api (`GET` / `PATCH /me/contact`, contract v0.4), shown on the
// Menntun landing page. The scopes are owned and registered by MMS.
export const up = compose(
  addScopesToClient({
    clientId: '@island.is/clients/api',
    scopeNames: ['@mms.is/person.contact.read', '@mms.is/person.contact.modify'],
  }),
)
