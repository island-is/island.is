import React, { ReactNode } from 'react'
import Markdown from 'markdown-to-jsx'
import { MessageDescriptor, useIntl } from 'react-intl'
import { Box, Text, BulletList, Bullet } from '@island.is/island-ui/core'

const BulletListBox = ({ children }: { children: ReactNode }) => {
  return (
    <Box marginBottom={3}>
      <BulletList space={2}>{children}</BulletList>
    </Box>
  )
}

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
  // markdown-to-jsx is able to handle this in most cases but when using 'formatMessage'
  // it does not work for some reason. That is the reason for this special handling here.
  // We will take a look at this later with the localization team.
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
            component: BulletListBox,
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
