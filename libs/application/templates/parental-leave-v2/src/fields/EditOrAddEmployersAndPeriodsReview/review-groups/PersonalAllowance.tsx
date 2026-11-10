import { Application } from '@island.is/application/types'
import {
  DataValue,
  RadioValue,
  ReviewGroup,
} from '@island.is/application/ui-components'
import { YES } from '@island.is/application/core'
import { Box, Tag, Text, Tooltip } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import { parentalLeaveFormMessages } from '../../../lib/messages'
import {
  getApplicationAnswers,
  getChangeBaseline,
  normalize,
} from '../../../lib/parentalLeaveUtils'

interface ReviewScreenProps {
  application: Application
  goToScreen?: (id: string) => void
}

const PersonalAllowance: FC<React.PropsWithChildren<ReviewScreenProps>> = ({
  application,
  goToScreen,
}) => {
  const { formatMessage } = useLocale()
  const { usePersonalAllowance, personalUseAsMuchAsPossible, personalUsage } =
    getApplicationAnswers(application.answers)

  const previous = getChangeBaseline(
    application.externalData,
  )?.personalAllowance

  const hasChanges =
    !!previous &&
    (normalize(previous.usePersonalAllowance) !==
      normalize(usePersonalAllowance) ||
      normalize(previous.personalUseAsMuchAsPossible) !==
        normalize(personalUseAsMuchAsPossible) ||
      normalize(previous.personalUsage) !== normalize(personalUsage))

  return (
    <ReviewGroup
      isEditable
      editAction={() => goToScreen?.('editPersonalAllowance')}
    >
      <Box display="flex" alignItems="center" columnGap={1} marginBottom={3}>
        <Text variant="h3">
          {formatMessage(parentalLeaveFormMessages.personalAllowance.title)}
        </Text>
        <Tooltip
          text={formatMessage(
            parentalLeaveFormMessages.personalAllowance.title,
          )}
        />
        {hasChanges && (
          <Tag variant="purple">
            {formatMessage(
              parentalLeaveFormMessages.shared.changesMadeNoApprovalTag,
            )}
          </Tag>
        )}
      </Box>
      {usePersonalAllowance === YES ? (
        <DataValue
          label={formatMessage(
            parentalLeaveFormMessages.personalAllowance.title,
          )}
          value={`${
            personalUseAsMuchAsPossible === YES ? 100 : personalUsage
          }%`}
        />
      ) : (
        <RadioValue
          label={formatMessage(
            parentalLeaveFormMessages.personalAllowance.title,
          )}
          value={usePersonalAllowance}
        />
      )}
    </ReviewGroup>
  )
}

export default PersonalAllowance
