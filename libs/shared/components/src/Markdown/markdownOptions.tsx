import {
  Bullet,
  BulletList,
  Link,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { MarkdownToJSX } from 'markdown-to-jsx'
import * as styles from './Markdown.css'

const markdownOverrides: MarkdownToJSX.Overrides = {
  ul: BulletList,
  ol: {
    component: BulletList,
    props: {
      type: 'ol',
    },
  },
  li: Bullet,
  a: {
    component: Link,
    props: {
      color: 'blue400',
      underline: 'small',
      underlineVisibility: 'always',
      newTab: true,
    },
  },
  h1: {
    component: Text,
    props: {
      variant: 'h3',
    },
  },
}

export const markdownOptions: MarkdownToJSX.Options = {
  overrides: markdownOverrides,
  wrapper: ({ children }) => (
    //TODO: Currently overriding the default p in markdown is removing link styles, we need to override global styles until we have a solution for overriding p with the Text component
    <div className={styles.container}>
      <Stack space={1}>{children}</Stack>
    </div>
  ),
  forceBlock: true,
  forceWrapper: true,
  disableParsingRawHTML: true,
}
