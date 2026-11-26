import { ReactNode } from 'react'

import { Box, Text } from '@island.is/island-ui/core'
import { LinkButton } from '@island.is/portals/my-pages/core'

export const PageIntro = ({
  intro,
  link,
  action,
}: {
  intro: ReactNode
  link?: { href: string; text: string }
  action?: ReactNode
}) => (
  <>
    <Text>{intro}</Text>
    {(link || action) && (
      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="center"
        flexWrap="wrap"
        columnGap={2}
        rowGap={2}
        marginTop={3}
      >
        {link && (
          <LinkButton
            to={link.href}
            text={link.text}
            variant="utility"
            icon="open"
          />
        )}
        {action}
      </Box>
    )}
  </>
)
