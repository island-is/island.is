import React from 'react'
import Markdown from 'markdown-to-jsx'

import {
  Bullet,
  BulletList,
  Icon,
  LinkContext,
  Text,
  TextProps,
} from '@island.is/island-ui/core'
import { helperStyles } from '@island.is/island-ui/theme'

import * as styles from './MarkdownText.css'

interface NewTabLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Read out after the link text, since the icon is only there to be seen */
  newTabLabel?: string
}

/** A link that says, in an icon and to a screen reader, where it is taking you */
const NewTabLink = ({ children, newTabLabel, ...props }: NewTabLinkProps) => (
  <a {...props} target="_blank" rel="noopener noreferrer">
    {children}
    <Icon
      icon="open"
      type="outline"
      size="small"
      className={styles.newTabIcon}
      ariaHidden
    />
    {newTabLabel && <span className={helperStyles.srOnly}>{newTabLabel}</span>}
  </a>
)

interface MarkdownTextProps {
  children: string
  color?: TextProps['color']
  variant?: TextProps['variant']
  replaceNewLinesWithBreaks?: boolean
  /** Opens the links in a tab of their own, marked with an icon */
  openLinksInNewTab?: boolean
  /** What the icon says to a screen reader, e.g. "Opnast í nýjum flipa" */
  newTabLabel?: string
}

export const MarkdownText: React.FC<
  React.PropsWithChildren<MarkdownTextProps>
> = ({
  children,
  color = null,
  variant = 'default',
  replaceNewLinesWithBreaks = true,
  openLinksInNewTab = false,
  newTabLabel,
}) => {
  const processedChildren = replaceNewLinesWithBreaks
    ? (children as string).replace(/\n/gi, '<br>')
    : children

  const markdown = (
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
            // Links written into the text itself, rather than handed to the
            // component, so they are marked up here for all of them at once
            ...(openLinksInNewTab && {
              a: {
                component: NewTabLink,
                props: {
                  newTabLabel,
                },
              },
            }),
          },
        }}
      >
        {processedChildren}
      </Markdown>
    </div>
  )

  if (!openLinksInNewTab) return markdown

  // `Text` hands the links it is given to whichever renderer the context
  // carries, which would otherwise put back a plain one, so the override above
  // only reaches the links `Text` leaves alone.
  return (
    <LinkContext.Provider
      value={{
        linkRenderer: (href, linkChildren) => (
          <NewTabLink href={href} newTabLabel={newTabLabel}>
            {linkChildren}
          </NewTabLink>
        ),
      }}
    >
      {markdown}
    </LinkContext.Provider>
  )
}
