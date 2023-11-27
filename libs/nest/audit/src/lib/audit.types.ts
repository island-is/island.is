import type { Auth } from '@island.is/auth-nest-tools'

interface BaseMessage {
  action: string
  namespace?: string
  resources?: string | string[]
  meta?: Record<string, unknown>
  alsoLog?: true
}

interface SystemAuditMessage extends BaseMessage {
  system: true
  auth?: never
}

interface DefaultAuditMessage extends BaseMessage {
  auth: Auth
  system?: never
}

export type AuditMessage = SystemAuditMessage | DefaultAuditMessage

// Template types
interface BaseAuditTemplate<ResultType> {
  action: string
  namespace?: string
  resources?:
    | string
    | string[]
    | ((result: ResultType) => string | string[] | undefined)
  meta?:
    | Record<string, unknown>
    | ((result: ResultType) => Record<string, unknown>)
  alsoLog?: true
}

interface SystemAuditTemplate<T> extends BaseAuditTemplate<T> {
  system: true
}
interface DefaultAuditTemplate<T> extends BaseAuditTemplate<T> {
  auth: Auth
}

export type AuditTemplate<T> = SystemAuditTemplate<T> | DefaultAuditTemplate<T>

export const isDefaultAuditMessage = (
  obj: AuditMessage,
): obj is DefaultAuditMessage =>
  Object.prototype.hasOwnProperty.call(obj, 'auth')

export const isDefaultAuditTemplate = <T>(
  obj: AuditTemplate<T>,
): obj is DefaultAuditTemplate<T> =>
  Object.prototype.hasOwnProperty.call(obj, 'auth')
