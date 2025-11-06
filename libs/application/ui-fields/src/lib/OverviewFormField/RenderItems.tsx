import { formatTextWithLocale } from '@island.is/application/core'
import {
  Application,
  FormTextWithLocale,
  KeyValueItem,
} from '@island.is/application/types'
import { Box, Divider, GridColumn, Text } from '@island.is/island-ui/core'
import { SpanType } from '@island.is/island-ui/core/types'
import { useLocale } from '@island.is/localization'
import { Markdown } from '@island.is/shared/components'
import { evaluateValueText } from './overviewUtils'

type Props = {
  item: KeyValueItem
  i: number
  title: FormTextWithLocale | undefined
  description: FormTextWithLocale | undefined
  application: Application
}

export const RenderItems = ({
  item,
  i,
  title,
  description,
  application,
}: Props) => {
  const { formatMessage, lang: locale } = useLocale()

  const span: SpanType | undefined =
    item.width === 'full'
      ? title || description
        ? ['12/12', '12/12', '12/12', '12/12']
        : i === 0
        ? ['10/12', '10/12', '10/12', '10/12']
        : ['12/12', '12/12', '12/12', '12/12']
      : item.width === 'half'
      ? ['9/12', '9/12', '9/12', '5/12']
      : undefined

  if (!item.keyText && !item.valueText) {
    return (
      <GridColumn key={`renderItems-${i}`} span={span}>
        {item.lineAboveKeyText && (
          <Box paddingBottom={3}>
            <Divider weight="black" thickness="thick" />
          </Box>
        )}
      </GridColumn>
    )
  }

  const createFormattedKeyTextWithIndex = (
    item: KeyValueItem,
    index?: number,
    useMarkdownFormatting = true,
  ): string => {
    const keyText =
      Array.isArray(item?.keyText) && index !== undefined
        ? item?.keyText?.[index] ?? ''
        : item?.keyText ?? ''

    const formattedKey = formatTextWithLocale(
      keyText,
      application,
      locale,
      formatMessage,
    )

    if (useMarkdownFormatting) {
      return `${item?.boldValueText ? '**' : ''}${formattedKey}: ${
        item?.boldValueText ? '**' : ''
      }`
    }
    return `${formattedKey}: `
  }

  type MdDescriptor = { id: string }

  const isMdDescriptor = (m: unknown): m is MdDescriptor =>
    typeof m === 'object' &&
    m !== null &&
    'id' in m &&
    typeof (m as { id?: unknown }).id === 'string' &&
    (m as MdDescriptor).id.endsWith('#markdown')

  const resolveDescriptor = (t: unknown) => {
    if (typeof t === 'function') {
      const fn = t as { length: number } & ((
        a: typeof application,
        b?: typeof locale,
      ) => unknown)
      try {
        return fn.length >= 2 ? fn(application, locale) : fn(application)
      } catch {
        return t
      }
    }
    return t
  }

  const isMarkdownDescriptor = (text: unknown): boolean => {
    if (Array.isArray(text)) {
      return text.some((x) => isMdDescriptor(resolveDescriptor(x)))
    }
    return isMdDescriptor(resolveDescriptor(text))
  }

  const keyTextValue = formatTextWithLocale(
    item?.keyText ?? '',
    application,
    locale,
    formatMessage,
  )

  const evaluatedValueText = evaluateValueText(item.valueText, application)

  return (
    <GridColumn key={i} span={span}>
      {item.lineAboveKeyText && (
        <Box paddingBottom={2}>
          <Divider weight="black" thickness="thick" />
        </Box>
      )}
      {!item.inlineKeyText && (
        <Markdown>
          {`#### **${
            Array.isArray(keyTextValue) //H4 markdown and bold
              ? keyTextValue.join(', ')
              : keyTextValue
          }**`}
        </Markdown>
      )}
      {Array.isArray(evaluatedValueText)
        ? evaluatedValueText
            .map((value, index) => {
              if (!value) {
                return null
              }

              const valueIsMarkdown = isMarkdownDescriptor(value)
              const prefix =
                item.inlineKeyText && Array.isArray(item?.keyText)
                  ? createFormattedKeyTextWithIndex(
                      item,
                      index,
                      valueIsMarkdown,
                    )
                  : ''
              const valueStr = Array.isArray(value)
                ? formatTextWithLocale(
                    value,
                    application,
                    locale,
                    formatMessage,
                  ).join(', ')
                : formatTextWithLocale(
                    value,
                    application,
                    locale,
                    formatMessage,
                  )
              if (valueIsMarkdown) {
                const renderedValue = item.boldValueText
                  ? `**${valueStr}**`
                  : valueStr
                return (
                  <Markdown key={`${value}-${index}`}>
                    {`${prefix}${renderedValue}`}
                  </Markdown>
                )
              }

              return (
                <Text
                  key={`${value}-${index}`}
                  as="p"
                  fontWeight={item.boldValueText ? 'semiBold' : undefined}
                >
                  {`${prefix}${valueStr}`}
                </Text>
              )
            })
            .filter(Boolean)
        : (() => {
            const valueIsMarkdown = isMarkdownDescriptor(evaluatedValueText)
            const formattedValue = formatTextWithLocale(
              evaluatedValueText ?? '',
              application,
              locale,
              formatMessage,
            )
            if (valueIsMarkdown) {
              const prefixMd =
                item.inlineKeyText &&
                !Array.isArray(item?.keyText) &&
                keyTextValue
                  ? `${item?.boldValueText ? '**' : ''}${keyTextValue}: ${
                      item?.boldValueText ? '**' : ''
                    }`
                  : ''
              const renderedValue = item.boldValueText
                ? `**${formattedValue}**`
                : formattedValue
              return <Markdown>{`${prefixMd}${renderedValue}`}</Markdown>
            }

            const prefixPlain =
              item.inlineKeyText &&
              !Array.isArray(item?.keyText) &&
              keyTextValue
                ? `${keyTextValue}: `
                : ''
            return (
              <Text
                as="p"
                fontWeight={item.boldValueText ? 'semiBold' : undefined}
              >
                {`${prefixPlain}${formattedValue}`}
              </Text>
            )
          })()}
    </GridColumn>
  )
}
