import { MessageDescriptor } from '@formatjs/intl'

export type FormatMessage = (
  descriptor: MessageDescriptor | string,
  values?: Record<string, any>,
) => string
