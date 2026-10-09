import { addScopesToClient, compose } from './helpers'

// Grants the API client the MMS scopes that gate the Mínar síður
// "Lykilupplýsingar" (key information) endpoints on the Frigg form-api for a
// child: `student.info.read` covers emergency contacts + language profile,
// `student.health.read` covers the health profile. The scopes are owned and
// registered by MMS; this only grants them to the island.is client that
// performs the X-Road token exchange (the education resolver runs in the API).
// TODO: add the corresponding write scopes once MMS confirms their names — the
// edit/delete mutations (add/update/delete contact, replace health/language)
// will need them.
export const up = compose(
  addScopesToClient({
    clientId: '@island.is/clients/api',
    scopeNames: ['@mms.is/student.info.read', '@mms.is/student.health.read'],
  }),
)
