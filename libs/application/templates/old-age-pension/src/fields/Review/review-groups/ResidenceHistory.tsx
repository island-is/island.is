import {
  DataValue,
  Label,
  ReviewGroup,
  Table,
} from '@island.is/application/ui-components'
import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { oldAgePensionFormMessage } from '../../../lib/messages'
import { ReviewGroupProps } from './props'
import { useStatefulAnswers } from '../../../hooks/useStatefulAnswers'
import React from 'react'
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
        <GridColumn
          span={['12/12', '12/12', '12/12', '12/12']}
          paddingBottom={3}
        >
          <Label>
            {formatMessage(
              oldAgePensionFormMessage.shared.residenceHistoryTitle,
            )}
          </Label>
          <Box paddingTop={6}>
            <Table columns={columns} data={data} />
          </Box>
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
          <DataValue
            label={formatMessage(
              oldAgePensionFormMessage.shared.residenceHistoryQuestion,
            )}
            value={residenceHistoryQuestion}
          />
        </GridColumn>
      </GridRow>
    </ReviewGroup>
  )
}
