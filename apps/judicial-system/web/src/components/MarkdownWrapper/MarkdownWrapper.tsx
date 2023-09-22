import React, { ReactNode } from 'react'
import Markdown from 'markdown-to-jsx'

import {
  Box,
  Bullet,
  BulletList,
  LinkV2,
  Text,
  TextProps,
} from '@island.is/island-ui/core'

import * as styles from './MarkdownWrapper.css'

const BulletListBox = ({ children }: { children: ReactNode }) => {
  return (
    <Box marginBottom={3}>
      <BulletList space={2}>{children}</BulletList>
    </Box>
  )
}

const TextComponent = ({ children, ...props }: { children: ReactNode }) => {
  return (
    <Box className={styles.paragraphContainer}>
      <Text {...props}>{children}</Text>
    </Box>
  )
}

const LinkComponent = ({
  children,
  href,
}: {
  children: ReactNode
  href: string
}) => {
  return (
    <LinkV2 href={href} className={styles.link}>
      {children}
    </LinkV2>
  )
}

interface Props {
  markdown: string
  textProps?: TextProps
}

const headingOverride = {
  component: Text,
  props: {
    variant: 'h4',
    marginBottom: 1,
  },
}

const DescriptionText = ({ markdown, textProps }: Props) => {
  // markdown-to-jsx is able to handle this in most cases but when using 'formatMessage'
  // it does not work for some reason. That is the reason for this special handling here.
  // We will take a look at this later with the localization team.
  const formattedMarkdown = markdown.replace(/&#39;/g, '&apos;')
  return (
    <Markdown
      options={{
        forceBlock: true,
        overrides: {
          p: {
            component: TextComponent,
            props: textProps,
          },
          span: {
            component: TextComponent,
            props: textProps,
          },
          h1: headingOverride,
          h2: headingOverride,
          h3: headingOverride,
          h4: headingOverride,
          a: { component: LinkComponent },
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
