import { ReactNode } from 'react'
import { FormatXMLElementFn, PrimitiveType } from 'intl-messageformat'
import { MessageDescriptor } from 'react-intl'

export type FormatMessageValues = Record<
  string,
  PrimitiveType | FormatXMLElementFn<string, string>
>
export type FormatMessageValuesWReact = Record<
  string,
  PrimitiveType | FormatXMLElementFn<ReactNode, ReactNode> | ReactNode
>

export interface FormatMessage {
  (descriptor: undefined): undefined
  (descriptor: MessageDescriptor | string, values?: FormatMessageValues): string
  (
    descriptor: MessageDescriptor | string,
    values?: FormatMessageValuesWReact,
  ): ReactNode
}
