import { environment } from '../../environment'

// @example SESSION_COOKIE_NAME = 'minarsidur-sid' or 'stjornbord-sid'
export const SESSION_COOKIE_NAME = `${environment.name.toLowerCase()}-sid`
