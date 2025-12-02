import React from 'react'
import Markdown from 'markdown-to-jsx'

import { Bullet, BulletList, Text, TextProps } from '@island.is/island-ui/core'

import * as styles from './MarkdownText.css'

interface MarkdownTextProps {
  children: string
  color?: TextProps['color']
  variant?: TextProps['variant']
  replaceNewLinesWithBreaks?: boolean
}

export const MarkdownText = ({
  children,
  color,
  variant = 'default',
  replaceNewLinesWithBreaks = true,
}: MarkdownTextProps) => {
  const processedChildren = replaceNewLinesWithBreaks
    ? (children as string).replace(/\n/gi, '<br>')
    : children

  return (
    <div className={styles.markdownText}>
      <Markdown
        options={{
          forceBlock: true,
          overrides: {
            p: {
              component: Text,
              props: {
                fontWeight: 'light',
                color,
                variant,
                lineHeight: 'lg',
              },
            },
            span: {
              component: Text,
              props: {
                fontWeight: 'light',
                color,
                variant,
                lineHeight: 'lg',
              },
            },
            h1: {
              component: Text,
              props: {
                fontWeight: 'semiBold',
                color,
                variant,
                lineHeight: 'lg',
                paddingBottom: '2',
                paddingTop: '6',
              },
            },
            ul: {
              component: BulletList,
              props: {
                space: 1,
              },
            },
            li: {
              component: Bullet,
            },
          },
        }}
      >
        {processedChildren}
      </Markdown>
    </div>
  )
}
