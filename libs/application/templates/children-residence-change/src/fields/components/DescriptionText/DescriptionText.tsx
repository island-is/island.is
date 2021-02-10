import React from 'react'
import Markdown from 'markdown-to-jsx'
import { MessageDescriptor } from 'react-intl'
import { useLocale } from '@island.is/localization'
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
  const { formatMessage } = useLocale()
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
      {formatMessage(text, format)}
    </Markdown>
  )
}

export default DescriptionText
