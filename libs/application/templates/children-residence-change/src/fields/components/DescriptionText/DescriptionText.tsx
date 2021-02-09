import React, { Fragment, ReactElement } from 'react'
import HtmlParser from 'react-html-parser'
import { MessageDescriptor } from 'react-intl'
import { useLocale } from '@island.is/localization'
import { Text, TextProps } from '@island.is/island-ui/core'

interface Props {
  text: MessageDescriptor
  format?: { [key: string]: string }
}

type formattedTextTypes = string | ReactElement | ReactElement[]

const isHeading = (type: string) => {
  const headingTags = ['h1', 'h2', 'h3', 'h4']
  return headingTags.includes(type)
}

const InnerText = ({
  item,
  lastItem,
}: {
  item: ReactElement
  lastItem: boolean
}) => {
  const heading = isHeading(item.type as string)
  const marginBottom = heading ? 1 : 2
  return (
    <Text
      variant={heading ? 'h4' : 'default'}
      marginBottom={lastItem ? 0 : marginBottom}
    >
      {item.props.children.map((element: string | ReactElement, i: number) => {
        return <Fragment key={i}>{element}</Fragment>
      })}
    </Text>
  )
}

const DescriptionText = ({ text, format }: Props) => {
  const { formatMessage } = useLocale()
  const formattedText = (formatMessage(text, {
    h1: (str: string) => <h1>{str}</h1>,
    h2: (str: string) => <h2>{str}</h2>,
    h3: (str: string) => <h3>{str}</h3>,
    h4: (str: string) => <h4>{str}</h4>,
    p: (str: string) => <p>{str}</p>,
    span: (str: string) => <span>{str}</span>,
    strong: (str: string) => <strong>{str}</strong>,
    em: (str: string) => <em>{str}</em>,
    ...format,
  }) as unknown) as formattedTextTypes

  // When formatting fails in 'formatMessage' it returns a string rather than a ReactElement.
  // Then we use the HtmlParser to parse the outputted string that contains markup
  const formattedTextType = typeof formattedText
  const parsedText: formattedTextTypes =
    formattedTextType === 'string'
      ? HtmlParser(formattedText as string)
      : formattedText
  if (Array.isArray(parsedText)) {
    return (
      <>
        {(parsedText as ReactElement[]).map((item, i) => {
          return (
            <InnerText
              key={i}
              item={item}
              lastItem={i + 1 === (parsedText as ReactElement[]).length}
            />
          )
        })}
      </>
    )
  }
  return <InnerText item={parsedText as ReactElement} lastItem={true} />
}

export default DescriptionText
