import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ApplicationConfigurations,
  FieldBaseProps,
} from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  Button,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { parentalLeaveFormMessages } from '../../lib/messages'
import { getChildrenInProgress } from '../../lib/parentalLeaveUtils'

/**
 * Explains why some children on the select-child screen cannot be picked, and
 * links to the unfinished application holding each of them.
 */
const InProgressApplications: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const childrenInProgress = getChildrenInProgress(application.externalData)

  if (childrenInProgress.length === 0) {
    return null
  }

  const messages = parentalLeaveFormMessages.selectChild

  return (
    <Box marginTop={4}>
      <AlertMessage
        type="info"
        title={formatMessage(messages.inProgressTitle)}
        message={
          <Stack space={2}>
            <Text variant="small">
              {formatMessage(messages.inProgressDescription)}
            </Text>
            {childrenInProgress.map(({ label, applicationId, isChange }) => (
              <Box
                key={applicationId}
                display="flex"
                flexWrap="wrap"
                alignItems="center"
                justifyContent="spaceBetween"
                columnGap={2}
              >
                <Text variant="small" fontWeight="semiBold">
                  {formatMessage(
                    isChange
                      ? messages.inProgressChangeFor
                      : messages.inProgressApplicationFor,
                    { child: formatMessage(label, label.values) },
                  )}
                </Text>
                <Button
                  variant="text"
                  size="small"
                  icon="arrowForward"
                  onClick={() =>
                    // The router is created with `basename: '/umsoknir'`.
                    navigate(
                      `/${ApplicationConfigurations.ParentalLeave.slug}/${applicationId}`,
                    )
                  }
                >
                  {formatMessage(messages.openApplication)}
                </Button>
              </Box>
            ))}
          </Stack>
        }
      />
    </Box>
  )
}

export default InProgressApplications
