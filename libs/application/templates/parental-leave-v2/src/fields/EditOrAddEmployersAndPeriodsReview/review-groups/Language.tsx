import { Application } from '@island.is/application/types'
import {
  Box,
  GridColumn,
  GridRow,
  Tag,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import { DataValue, ReviewGroup } from '@island.is/application/ui-components'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import { parentalLeaveFormMessages } from '../../../lib/messages'
import {
  getApplicationAnswers,
  getChangeBaseline,
  normalize,
} from '../../../lib/parentalLeaveUtils'
import { Languages } from '../../../constants'

interface ReviewScreenProps {
  application: Application
  goToScreen?: (id: string) => void
}

const Language: FC<React.PropsWithChildren<ReviewScreenProps>> = ({
  application,
  goToScreen,
}) => {
  const { formatMessage } = useLocale()
  const { language } = getApplicationAnswers(application.answers)

  const baseline = getChangeBaseline(application.externalData)

  const hasChanges =
    !!baseline && normalize(baseline.language) !== normalize(language)

  return (
    <ReviewGroup isEditable editAction={() => goToScreen?.('infoSection')}>
      <Box display="flex" alignItems="center" columnGap={1} marginBottom={3}>
        <Text variant="h3">
          {formatMessage(parentalLeaveFormMessages.reviewScreen.additionalInfo)}
        </Text>
        <Tooltip
          text={formatMessage(parentalLeaveFormMessages.shared.infoTooltip)}
        />
        {hasChanges && (
          <Tag variant="purple">
            {formatMessage(
              parentalLeaveFormMessages.shared.changesMadeNoApprovalTag,
            )}
          </Tag>
        )}
      </Box>
      <GridRow>
        <GridColumn span={['7/12', '7/12', '7/12', '12/12']}>
          <DataValue
            label={formatMessage(
              parentalLeaveFormMessages.reviewScreen.language,
            )}
            value={
              formatMessage(
                language === Languages.EN
                  ? parentalLeaveFormMessages.applicant.english
                  : parentalLeaveFormMessages.applicant.icelandic,
              ) ?? ''
            }
          />
        </GridColumn>
      </GridRow>
    </ReviewGroup>
  )
}

export default Language
