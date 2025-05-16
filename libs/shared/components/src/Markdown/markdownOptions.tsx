import {
  Bullet,
  BulletList,
  LinkV2,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { MarkdownToJSX } from 'markdown-to-jsx'
import React from 'react'
import * as styles from './Markdown.css'
import { OptionalOverrides } from './Markdown'

export const getMarkdownOptions = (
  options: OptionalOverrides,
): MarkdownToJSX.Options => {
  return {
    overrides: getMarkdownOverrides(options),
    wrapper: ({ children }: { children: React.ReactNode }) => (
      //TODO: Currently overriding the default p in markdown is removing link styles, we need to override global styles until we have a solution for overriding p with the Text component
      <div className={styles.container}>
        <Stack space={1}>{children}</Stack>
      </div>
    ),
    forceBlock: true,
    forceWrapper: true,
    disableParsingRawHTML: true,
  }
}

const getMarkdownOverrides = (
  options: OptionalOverrides,
): MarkdownToJSX.Overrides => {
  return {
    ul: BulletList,
    ol: {
      component: BulletList,
      props: {
        type: 'ol',
      },
    },
    li: Bullet,
    a: {
      component: LinkV2,
      props: {
        color: 'blue400',
        underline: 'small',
        underlineVisibility: 'always',
        newTab: options.openLinksInNewTab,
      },
    },
    h1: {
      component: Text,
      props: {
        variant: 'h3',
      },
    },
  }
}
