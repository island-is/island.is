import {
  Label,
  RadioValue,
  ReviewGroup,
} from '@island.is/application/ui-components'
import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { oldAgePensionFormMessage } from '../../../lib/messages'
import { ReviewGroupProps } from './props'
import ResidenceHistoryTable from '../../ResidenceHistory/ResidenceHistoryTable'
import {
  getApplicationAnswers,
  getApplicationExternalData,
} from '../../../lib/oldAgePensionUtils'
import { NO, YES } from '@island.is/application/core'

export const ResidenceHistory = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const { residenceHistoryQuestion } = getApplicationAnswers(
    application.answers,
  )
  const { residenceHistory } = getApplicationExternalData(
    application.externalData,
  )

  return (
    <ReviewGroup
      isEditable={
        (editable && residenceHistoryQuestion === YES) ||
        residenceHistoryQuestion === NO
      }
      editAction={() => goToScreen?.('residenceHistory')}
      isLast={true}
    >
      <GridRow>
        {residenceHistory.length > 0 && (
          <GridColumn
            span={['12/12', '12/12', '12/12', '12/12']}
            paddingBottom={3}
          >
            <Label>
              {formatMessage(
                oldAgePensionFormMessage.residence.residenceHistoryTitle,
              )}
            </Label>
            <Box paddingTop={3}>
              <ResidenceHistoryTable application={application} />
            </Box>
          </GridColumn>
        )}
        {residenceHistoryQuestion && (
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <RadioValue
              label={formatMessage(
                oldAgePensionFormMessage.residence.residenceHistoryQuestion,
              )}
              value={residenceHistoryQuestion}
            />
          </GridColumn>
        )}
      </GridRow>
    </ReviewGroup>
  )
}
