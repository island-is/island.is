import Markdown from 'markdown-to-jsx'
import { Bullet, BulletList, Text } from '@island.is/island-ui/core'
import React from 'react'
import * as styles from './MarkdownText.treat'

interface MarkdownTextProps {
  children: string
  color?: string
  variant?: string
}

export const MarkdownText: React.FC<MarkdownTextProps> = ({
  children,
  color = 'default',
  variant = 'default',
}) => {
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
        {children}
      </Markdown>
    </div>
  )
}
