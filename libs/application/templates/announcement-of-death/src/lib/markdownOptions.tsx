import {
  Bullet,
  BulletList,
  Link,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { MarkdownToJSX } from 'markdown-to-jsx'
import React from 'react'

const markdownOverrides: MarkdownToJSX.Overrides = {
  ul: BulletList,
  li: Bullet,
  a: {
    component: Link,
    props: {
      color: 'blue400',
      underline: 'small',
      underlineVisibility: 'always',
    },
  },
  h1: {
    component: Text,
    props: {
      variant: 'h3',
    },
  },
  p: {
    component: Text,
    props: {
      fontWeight: 'light',
    },
  },
}

export const markdownOptions: MarkdownToJSX.Options = {
  overrides: markdownOverrides,
  wrapper: ({ children }) => <Stack space={1}>{children}</Stack>,
}
