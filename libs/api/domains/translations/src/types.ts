import { MessageDescriptor } from '@formatjs/intl'

export type StaticTextObject = MessageDescriptor & {
  values?: Record<string, unknown>
}

export type FormatMessage = (
  descriptor: StaticTextObject | string,
  values?: Record<string, unknown>,
) => string
