import { Bullet, BulletList, Link, Stack } from '@island.is/island-ui/core'
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
}

export const markdownOptions: MarkdownToJSX.Options = {
  overrides: markdownOverrides,
  wrapper: ({ children }) => <Stack space={1}>{children}</Stack>,
}
