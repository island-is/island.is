import { Application } from '@island.is/application/types'
import { ReviewGroup } from '@island.is/application/ui-components'
import { getValueViaPath } from '@island.is/application/core'
import { Box, Button, Tag, Text, Tooltip } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import { SummaryRights } from '../../Rights/SummaryRights'
import { parentalLeaveFormMessages } from '../../../lib/messages'
import { getChangeBaseline } from '../../../lib/parentalLeaveUtils'

interface ReviewScreenProps {
  application: Application
  goToScreen?: (id: string) => void
}

const Rights: FC<React.PropsWithChildren<ReviewScreenProps>> = ({
  application,
  goToScreen,
}) => {
  const { formatMessage } = useLocale()
  const answers = application.answers

  const transferRights = getValueViaPath(answers, 'transferRights') ?? ''
  const requestDays = getValueViaPath(answers, 'requestRights.requestDays') ?? 0
  const giveDays = getValueViaPath(answers, 'giveRights.giveDays') ?? 0
  const multipleBirthsRequestDays =
    getValueViaPath(answers, 'multipleBirthsRequestDays') ?? 0

  const previousRights = getChangeBaseline(application.externalData)?.rights

  const hasChanges =
    !!previousRights &&
    (String(previousRights.transferRights) !== String(transferRights) ||
      Number(previousRights.requestDays) !== Number(requestDays) ||
      Number(previousRights.giveDays) !== Number(giveDays) ||
      Number(previousRights.multipleBirthsRequestDays) !==
        Number(multipleBirthsRequestDays))

  const needsApproval =
    hasChanges &&
    !!previousRights &&
    Number(previousRights.requestDays) !== Number(requestDays)

  return (
    <ReviewGroup>
      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="center"
        marginBottom={3}
      >
        <Box display="flex" alignItems="center" columnGap={1}>
          <Text variant="h3">
            {formatMessage(parentalLeaveFormMessages.shared.yourRights)}
          </Text>
          <Tooltip
            text={formatMessage(parentalLeaveFormMessages.shared.rightsTooltip)}
          />
          {hasChanges && (
            <Tag variant="purple">
              {formatMessage(
                needsApproval
                  ? parentalLeaveFormMessages.shared.changesMadeTag
                  : parentalLeaveFormMessages.shared.changesMadeNoApprovalTag,
              )}
            </Tag>
          )}
        </Box>
        <Button
          variant="utility"
          icon="pencil"
          onClick={() => goToScreen?.('editRightsIntro')}
        >
          {formatMessage(parentalLeaveFormMessages.shared.formEditTitle)}
        </Button>
      </Box>
      <SummaryRights application={application} />
    </ReviewGroup>
  )
}

export default Rights
