import Markdown from 'markdown-to-jsx'
import { Bullet, BulletList, Text, TextProps } from '@island.is/island-ui/core'
import React from 'react'
import * as styles from './MarkdownText.css'

interface MarkdownTextProps {
  children: string
  color?: TextProps['color']
  variant?: TextProps['variant']
}

export const MarkdownText: React.FC<
  React.PropsWithChildren<MarkdownTextProps>
> = ({ children, color = null, variant = 'default' }) => {
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
        {(children as string).replace(/\n/gi, '<br>')}
      </Markdown>
    </div>
  )
}
