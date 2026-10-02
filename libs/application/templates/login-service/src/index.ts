import LoginServiceTemplate from './lib/LoginServiceTemplate'
import * as appMessages from './lib/messages'

export const getFields = () => import('./fields/')

export * from './lib/messages'

export const messages = appMessages

export default LoginServiceTemplate
