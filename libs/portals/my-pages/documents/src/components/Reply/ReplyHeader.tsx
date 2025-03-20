import { Box, Button, Text } from '@island.is/island-ui/core'
import { InformationPaths } from '@island.is/portals/my-pages/information'
import React from 'react'
import { useNavigate } from 'react-router-dom'

interface ReplyHeaderProps {
  initials: string
  title: string
  subTitle: string
  secondSubTitle?: string
  hasEmail?: boolean
  displayCloseButton?: boolean
  onClose?: () => void
}

const ReplyHeader: React.FC<ReplyHeaderProps> = ({
  initials,
  title,
  subTitle,
  secondSubTitle,
  hasEmail,
  displayCloseButton,
  onClose,
}) => {
  const navigate = useNavigate()

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="spaceBetween"
      paddingTop={3}
    >
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="spaceBetween"
        marginBottom={3}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          background={'blueberry100'}
          borderRadius="full"
          style={{ width: 56, height: 56 }}
        >
          <Text variant="h5" as="p">
            {initials}
          </Text>
        </Box>

        <Box display={'flex'} flexDirection={'column'} marginLeft={2}>
          <Text variant="eyebrow" truncate fontWeight="medium">
            {title}
          </Text>
          <Box display="flex" flexDirection="column">
            <Text variant="medium">{subTitle}</Text>

            {hasEmail ? (
              <Text variant="medium">{secondSubTitle}</Text>
            ) : (
              <Button
                variant="text"
                icon="pencil"
                iconType="outline"
                size="small"
                onClick={() => {
                  navigate(InformationPaths.Settings)
                }}
              >
                Vinsamlegast skráðu netfang
              </Button>
            )}
          </Box>
        </Box>
      </Box>
      {/* Close button */}
      {displayCloseButton && (
        <Box>
          <Button circle icon="close" colorScheme="light" onClick={onClose} />
        </Box>
      )}
    </Box>
  )
}

export default ReplyHeader
