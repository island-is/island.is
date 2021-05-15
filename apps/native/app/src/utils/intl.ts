import type {
  FormatXMLElementFn,
  Options as IntlMessageFormatOptions,
  PrimitiveType,
} from 'intl-messageformat'
import React from 'react'
import {
  FormattedMessage as IntlFormattedMessage,
  IntlShape,
  MessageDescriptor,
  useIntl as intlUseIntl,
} from 'react-intl'
import { Props } from 'react-intl/src/components/message'
import { TranslatedMessage } from '../messages'

/**
 * There should be a better way of handling this,
 * but this hack overwrites the `<FormattedMessage />` and `intl.formatMessage`
 * to allow the `id` parameter to be typed according to the available messages.
 */

interface TypedProps<
  V extends Record<string, any> = Record<string, React.ReactNode>
> extends Props {
  id?: TranslatedMessage | number | undefined
}

interface TypedMessageDescriptor extends MessageDescriptor {
  id?: TranslatedMessage | number | undefined
}

declare class TypedFormattedMessage<
  V extends Record<string, any> = Record<
    string,
    | PrimitiveType
    | React.ReactElement
    | FormatXMLElementFn<React.ReactNode, React.ReactNode>
  >
> extends React.Component<TypedProps<V>> {
  static displayName: string
  shouldComponentUpdate(nextProps: TypedProps<V>): boolean
  render(): JSX.Element
}

interface TypedIntlShape extends IntlShape {
  formatMessage(
    descriptor: TypedMessageDescriptor,
    values?: Record<string, PrimitiveType | FormatXMLElementFn<string, string>>,
    opts?: IntlMessageFormatOptions,
  ): string
}

declare function typedUseIntl(): TypedIntlShape

export * from 'react-intl'
export const FormattedMessage: typeof TypedFormattedMessage = IntlFormattedMessage as typeof TypedFormattedMessage
export const useIntl: typeof typedUseIntl = intlUseIntl
