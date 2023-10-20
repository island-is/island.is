import {
  Label,
  RadioValue,
  ReviewGroup,
} from '@island.is/application/ui-components'
import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { oldAgePensionFormMessage } from '../../../lib/messages'
import { ReviewGroupProps } from './props'
import { useStatefulAnswers } from '../../../hooks/useStatefulAnswers'
import ResidenceHistoryTable from '../../ResidenceHistory/ResidenceHistoryTable'

export const ResidenceHistory = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const [{ residenceHistoryQuestion }] = useStatefulAnswers(application)

  return (
    <ReviewGroup
      isEditable={editable}
      editAction={() => goToScreen?.('residenceHistory')}
      isLast={true}
    >
      <GridRow>
        {!residenceHistoryQuestion && (
          <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
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
