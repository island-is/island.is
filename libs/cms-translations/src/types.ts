import { MessageDescriptor } from '@formatjs/intl'

export interface FormatMessage {
  (descriptor: undefined): undefined
  (descriptor: MessageDescriptor | string, values?: Record<string, any>): string
}
