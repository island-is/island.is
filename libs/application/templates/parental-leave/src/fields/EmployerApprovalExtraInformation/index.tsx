import React, { FC } from 'react'

import { Application, RecordObject, Field } from '@island.is/application/core'
import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { DataValue } from '@island.is/application/ui-components'

import { parentalLeaveFormMessages } from '../../lib/messages'
import { useUnion as useUnionOptions } from '../../hooks/useUnion'
import { usePensionFund as usePensionFundOptions } from '../../hooks/usePensionFund'
import { useApplicationAnswers } from '../../hooks/useApplicationAnswers'

interface ScreenProps {
  application: Application
  field: Field
  errors?: RecordObject
}

type selectOption = {
  label: string
  value: string
}

const EmployerApprovalExtraInformation: FC<ScreenProps> = ({ application }) => {
  const pensionFundOptions = usePensionFundOptions()
  const unionOptions = useUnionOptions()
  const { formatMessage } = useLocale()
  const { pensionFund, union } = useApplicationAnswers(application)

  const getSelectOptionLabel = (options: selectOption[], id: string) =>
    options.find((option) => option.value === id)?.label

  return (
    <GridRow marginTop={2}>
      <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
        <DataValue
          label={formatMessage(
            parentalLeaveFormMessages.shared.salaryLabelPensionFund,
          )}
          value={getSelectOptionLabel(pensionFundOptions, pensionFund)}
        />
      </GridColumn>

      <GridColumn
        paddingTop={[2, 2, 2, 0]}
        span={['12/12', '12/12', '12/12', '5/12']}
      >
        <DataValue
          label={formatMessage(
            parentalLeaveFormMessages.shared.salaryLabelUnion,
          )}
          value={getSelectOptionLabel(unionOptions, union)}
        />
      </GridColumn>
    </GridRow>
  )
}

export default EmployerApprovalExtraInformation
