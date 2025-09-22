import { Box, Button, Inline, Stack, Text } from '@island.is/island-ui/core'

import * as styles from './MobileDrawer.css'

interface MobileDrawerProps {
  totalText: string
  seeBreakdownText: string
  onSeeBreakdownClick: () => void
  priceText: string
  pointsText: string
  chatBubbleIsPushedUp: boolean
}

export const MobileDrawer = ({
  totalText,
  seeBreakdownText,
  onSeeBreakdownClick,
  priceText,
  pointsText,
  chatBubbleIsPushedUp,
}: MobileDrawerProps) => {
  return (
    <Box
      background="purple100"
      padding={2}
      className={styles.container}
      style={{ visibility: chatBubbleIsPushedUp ? 'visible' : 'hidden' }}
    >
      <Box
        display="flex"
        width="full"
        justifyContent="spaceBetween"
        alignItems="center"
      >
        <Inline alignY="center" space={2}>
          <Text variant="eyebrow" fontWeight="semiBold">
            {totalText}
          </Text>
          <Stack space={1}>
            <Text variant="small" fontWeight="semiBold">
              {priceText}
            </Text>
            <Text variant="small" fontWeight="semiBold">
              {pointsText}
            </Text>
          </Stack>
        </Inline>
        <Button variant="text" size="small" onClick={onSeeBreakdownClick}>
          {seeBreakdownText}
        </Button>
      </Box>
    </Box>
  )
}
