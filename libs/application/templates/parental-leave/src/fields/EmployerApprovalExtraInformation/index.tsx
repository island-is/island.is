import React, { FC } from 'react'

import { Application, RecordObject, Field } from '@island.is/application/core'
import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  DataValue,
  Label,
  RadioValue,
  ReviewGroup,
} from '@island.is/application/ui-components'

import { parentalLeaveFormMessages } from '../../lib/messages'
import { YES, NO, MANUAL } from '../../constants'
import { Boolean } from '../../hooks/useApplicationAnswers'
import { useUnion as useUnionOptions } from '../../hooks/useUnion'
import { usePensionFund as usePensionFundOptions } from '../../hooks/usePensionFund'
import { useStatefulAnswers } from '../../hooks/useStatefulAnswers'

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
  const [{ pensionFund, union }, setStateful] = useStatefulAnswers(application)

  const getSelectOptionLabel = (options: selectOption[], id: string) =>
    options.find((option) => option.value === id)?.label

  return (
    <>
      <Box>
        <GridRow marginBottom={2}>
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
      </Box>
    </>
  )
}

export default EmployerApprovalExtraInformation
