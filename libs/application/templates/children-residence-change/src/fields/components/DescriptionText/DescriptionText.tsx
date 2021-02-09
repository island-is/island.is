import React, { Fragment, ReactElement } from 'react'
import HtmlParser from 'react-html-parser'
import { MessageDescriptor } from 'react-intl'
import { useLocale } from '@island.is/localization'
import { Text } from '@island.is/island-ui/core'

interface Props {
  text: MessageDescriptor
  format?: { [key: string]: string }
}

const headingTags = ['h1', 'h2', 'h3', 'h4']
const DescriptionText = ({ text, format }: Props) => {
  console.log({ text })
  const { formatMessage } = useLocale()
  const description: string | ReactElement[] = (formatMessage(text, {
    h1: (str: string) => <h1>{str}</h1>,
    h2: (str: string) => <h2>{str}</h2>,
    h3: (str: string) => <h3>{str}</h3>,
    h4: (str: string) => <h4>{str}</h4>,
    p: (str: string) => <p>{str}</p>,
    strong: (str: string) => <strong>{str}</strong>,
    em: (str: string) => <em>{str}</em>,
    ...format,
  }) as unknown) as string | ReactElement[]
  const parsedDescription =
    typeof description === 'string'
      ? HtmlParser(description as string)
      : description
  return (
    <>
      {(parsedDescription as ReactElement[]).map((item, i) => {
        const isHeading = headingTags.includes(item.type as string)
        const marginBottom = isHeading ? 1 : 2
        return (
          <Text
            key={i}
            variant={isHeading ? 'h4' : 'default'}
            marginBottom={i + 1 === description.length ? 0 : marginBottom}
          >
            {item.props.children.map(
              (element: string | ReactElement, index: number) => {
                return <Fragment key={index}>{element}</Fragment>
              },
            )}
          </Text>
        )
      })}
    </>
  )
}

export default DescriptionText
