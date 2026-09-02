import type { ReactNode } from 'react'
import Markdown from 'markdown-to-jsx'

import { LinkV2, Text } from '@island.is/island-ui/core'
import { shouldLinkOpenInNewWindow } from '@island.is/shared/utils'

/** The links markdown-to-jsx hands over for `[texti](slóð)` in the CMS text */
const DisclaimerLink = ({
  href,
  children,
}: {
  href?: string
  children?: ReactNode
}) => (
  <LinkV2
    href={href ?? ''}
    color="blue400"
    underline="small"
    underlineVisibility="always"
    // A link off the site opens next to the page rather than taking the
    // visitor away from a conversation they have open
    newTab={shouldLinkOpenInNewWindow(href ?? '')}
  >
    {children}
  </LinkV2>
)

interface DisclaimerTextProps {
  /** The disclaimer as it is written in the CMS, markdown links and all */
  children: string
}

/**
 * The fine print underneath the question box. The text is edited in Contentful,
 * so any links it carries are written into it as markdown, `[texti](slóð)`,
 * rather than being configured apart from the words they belong to.
 */
export const DisclaimerText = ({ children }: DisclaimerTextProps) => (
  <Text variant="small" color="dark400">
    <Markdown
      options={{
        // Kept as one run of text inside the Text above, rather than markdown
        // opening a paragraph of its own
        forceInline: true,
        overrides: {
          a: { component: DisclaimerLink },
        },
      }}
    >
      {children}
    </Markdown>
  </Text>
)
