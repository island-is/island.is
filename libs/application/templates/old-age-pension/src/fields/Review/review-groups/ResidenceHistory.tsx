import {
  Label,
  RadioValue,
  ReviewGroup,
  Table,
} from '@island.is/application/ui-components'
import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { oldAgePensionFormMessage } from '../../../lib/messages'
import { ReviewGroupProps } from './props'
import { useStatefulAnswers } from '../../../hooks/useStatefulAnswers'
import { residenceHistoryTableData } from '../../../lib/oldAgePensionUtils'

export const ResidenceHistory = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const [{ residenceHistoryQuestion }] = useStatefulAnswers(application)
  const { data, columns } = residenceHistoryTableData(application)

  return (
    <ReviewGroup
      isEditable={editable}
      editAction={() => goToScreen?.('residenceHistory')}
      isLast={true}
    >
      <GridRow marginBottom={3}>
        {data.length !== 0 && (
          <GridColumn
            span={['12/12', '12/12', '12/12', '12/12']}
            paddingBottom={3}
          >
            <Label>
              {formatMessage(
                oldAgePensionFormMessage.residence.residenceHistoryTitle,
              )}
            </Label>
            {data && (
              <Box paddingTop={3}>
                <Table columns={columns} data={data} />
              </Box>
            )}
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
