import { getSourceSettings, isDryRun } from './config'

describe('getSourceSettings', () => {
  it('reads the settings for a source', () => {
    expect(
      getSourceSettings('rgr', {
        AD_STAFF_IMPORT_RGR_TENANT_ID: 'tenant',
        AD_STAFF_IMPORT_RGR_CLIENT_ID: 'client',
        AD_STAFF_IMPORT_RGR_CLIENT_SECRET: 'secret',
        AD_STAFF_IMPORT_RGR_GROUP_ID: 'group',
      }),
    ).toEqual({
      credentials: {
        tenantId: 'tenant',
        clientId: 'client',
        clientSecret: 'secret',
      },
      groupId: 'group',
    })
  })

  it('returns null when a setting is missing', () => {
    expect(
      getSourceSettings('rgr', {
        AD_STAFF_IMPORT_RGR_TENANT_ID: 'tenant',
        AD_STAFF_IMPORT_RGR_CLIENT_ID: 'client',
        AD_STAFF_IMPORT_RGR_CLIENT_SECRET: ' ',
        AD_STAFF_IMPORT_RGR_GROUP_ID: 'group',
      }),
    ).toBeNull()
  })
})

describe('isDryRun', () => {
  it('is a dry run unless explicitly turned off', () => {
    expect(isDryRun({})).toBe(true)
    expect(isDryRun({ AD_STAFF_IMPORT_DRY_RUN: 'true' })).toBe(true)
    expect(isDryRun({ AD_STAFF_IMPORT_DRY_RUN: 'False' })).toBe(false)
  })
})
