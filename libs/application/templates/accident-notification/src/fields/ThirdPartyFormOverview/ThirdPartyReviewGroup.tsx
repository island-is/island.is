import { Box, Button, Divider } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { overview } from '../../lib/messages'

interface ReviewGroupProps {
  editAction?(): void
  isEditable?: boolean
}

export const ThirdPartyReviewGroup: FC<ReviewGroupProps> = ({
  children,
  editAction,
  isEditable = true,
}) => {
  const { formatMessage } = useLocale()

  const handleClick = () => {
    if (editAction) {
      editAction()
    }
  }

  return (
    <Box>
      <Divider />

      <Box position="relative" paddingY={4}>
        {isEditable && (
          <Box position="absolute" top={4} right={0} style={{ zIndex: 10 }}>
            <Button variant="utility" icon="pencil" onClick={handleClick}>
              {formatMessage(overview.forThirdParty.buttonText)}
            </Button>
          </Box>
        )}

        {children}
      </Box>
    </Box>
  )
}
