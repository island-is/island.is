import { MicrosoftGraphCredentials } from '../repositories/microsoft-graph/microsoftGraph.client'

export interface AdStaffSourceSettings {
  credentials: MicrosoftGraphCredentials
  /** The Entra ID group whose members are shown on the website */
  groupId: string
}

const SETTINGS = {
  tenantId: 'TENANT_ID',
  clientId: 'CLIENT_ID',
  clientSecret: 'CLIENT_SECRET',
  groupId: 'GROUP_ID',
} as const

export const getEnvName = (sourceKey: string, setting: keyof typeof SETTINGS) =>
  `AD_STAFF_IMPORT_${sourceKey.toUpperCase()}_${SETTINGS[setting]}`

/** Returns null when the source is not configured, so it is skipped */
export const getSourceSettings = (
  sourceKey: string,
  env: NodeJS.ProcessEnv = process.env,
): AdStaffSourceSettings | null => {
  const read = (setting: keyof typeof SETTINGS) =>
    env[getEnvName(sourceKey, setting)]?.trim() || undefined

  const tenantId = read('tenantId')
  const clientId = read('clientId')
  const clientSecret = read('clientSecret')
  const groupId = read('groupId')

  if (!tenantId || !clientId || !clientSecret || !groupId) {
    return null
  }

  return { credentials: { tenantId, clientId, clientSecret }, groupId }
}

/** Writes only happen when AD_STAFF_IMPORT_DRY_RUN is explicitly 'false' */
export const isDryRun = (env: NodeJS.ProcessEnv = process.env) =>
  env.AD_STAFF_IMPORT_DRY_RUN?.trim().toLowerCase() !== 'false'
