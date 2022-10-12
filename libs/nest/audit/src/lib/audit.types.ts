import type { Auth } from '@island.is/auth-nest-tools'

interface BaseMessage {
  action: string
  namespace?: string
  resources?: string | string[]
  meta?: Record<string, unknown>
}

interface SystemAuditMessage extends BaseMessage {
  system: true
}

interface DefaultAuditMessage extends BaseMessage {
  auth: Auth
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
