import { FC } from 'react'

import { Box, Button, Divider } from '@island.is/island-ui/core'

interface ReviewGroupProps {
  isLast?: boolean
  editMessage?: string
  handleClick?: () => void
}

export const ReviewGroup: FC<React.PropsWithChildren<ReviewGroupProps>> = ({
  children,
  isLast,
  editMessage,
  handleClick,
}) => {
  return (
    <Box>
      <Divider />

      <Box position="relative" paddingY={4}>
        {editMessage && (
          <Box
            position="absolute"
            top={4}
            right={0}
            style={{ zIndex: 10, maxWidth: '50%' }}
          >
            <Button variant="utility" icon="pencil" onClick={handleClick}>
              {editMessage}
            </Button>
          </Box>
        )}
        {children}
      </Box>

      {!isLast && <Divider />}
    </Box>
  )
}
