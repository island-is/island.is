export const SERVICE_PORTAL = 'service-portal'
export const ADMIN_PORTAL = 'admin-portal'

export type BffClient = typeof SERVICE_PORTAL | typeof ADMIN_PORTAL

/**
 * The value is the keyPath used to construct urls in environment variables.
 */
export const bffClients: { [key in BffClient]: string } = {
  [SERVICE_PORTAL]: 'minarsidur',
  [ADMIN_PORTAL]: 'stjornbord',
}
