import { addScopesToClient, compose } from './helpers'

// Grants the API client the MMS scopes that gate the Mínar síður
// "Lykilupplýsingar" (key information) endpoints on the Frigg form-api for a
// child. `student.info.*` covers emergency contacts + language profile,
// `student.health.*` covers the health profile; `.read` for the GETs and
// `.modify` for the add/update/delete + replace mutations (MMS names the write
// scopes `.modify`, not `.write`). The scopes are owned and registered by MMS;
// this only grants them to the island.is client that performs the X-Road token
// exchange (the education resolver runs in the API).
export const up = compose(
  addScopesToClient({
    clientId: '@island.is/clients/api',
    scopeNames: [
      '@mms.is/student.info.read',
      '@mms.is/student.health.read',
      '@mms.is/student.info.modify',
      '@mms.is/student.health.modify',
    ],
  }),
)
