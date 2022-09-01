import { MessageDescriptor } from 'react-intl'

export type RecordObject<T = unknown> = Record<string, T>
export type StaticTextObject = MessageDescriptor & {
  values?: RecordObject<any>
}

export type StaticText = StaticTextObject | string
