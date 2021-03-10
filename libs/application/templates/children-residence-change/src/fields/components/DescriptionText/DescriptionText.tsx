import React from 'react'
import Markdown from 'markdown-to-jsx'
import { MessageDescriptor, useIntl } from 'react-intl'
import { Text, BulletList, Bullet } from '@island.is/island-ui/core'

interface Props {
  text: MessageDescriptor
  format?: { [key: string]: string }
}

const headingOverride = {
  component: Text,
  props: {
    variant: 'h4',
    marginBottom: 1,
  },
}

const textOverride = {
  component: Text,
  props: {
    marginBottom: 2,
  },
}

const DescriptionText = ({ text, format }: Props) => {
  const { formatMessage } = useIntl()
  const markdown = formatMessage(text, format)
  const formattedMarkdown = markdown.replace(/&#39;/g, '&apos;')
  return (
    <Markdown
      options={{
        forceBlock: true,
        overrides: {
          p: textOverride,
          span: textOverride,
          h1: headingOverride,
          h2: headingOverride,
          h3: headingOverride,
          h4: headingOverride,
          ul: {
            component: BulletList,
          },
          li: {
            component: Bullet,
          },
        },
      }}
    >
      {formattedMarkdown}
    </Markdown>
  )
}

export default DescriptionText
