/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'

import { m } from '../../lib/messages'
import { getEstateDataFromApplication } from '../../lib/utils'

export const MoneyAndDepositFields: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application, field }) => {
  const { id } = field
  const { formatMessage } = useLocale()
  const { setValue, getValues } = useFormContext()
  const [hasInitialized, setHasInitialized] = useState(false)

  const infoFieldId = `${id}.info`
  const valueFieldId = `${id}.value`

  useEffect(() => {
    if (hasInitialized) return

    const estateData = getEstateDataFromApplication(application)
    const prefill = estateData?.estate?.moneyAndDeposit as any | undefined
    const currentInfo = getValues(infoFieldId)
    const currentValue = getValues(valueFieldId)

    if (prefill) {
      if (!currentInfo && prefill.info) setValue(infoFieldId, prefill.info)
      if (!currentValue && prefill.value) setValue(valueFieldId, prefill.value)
    }

    setHasInitialized(true)
  }, [
    application,
    setValue,
    getValues,
    infoFieldId,
    valueFieldId,
    hasInitialized,
  ])

  return (
    <Box>
      <GridRow>
        <GridColumn span="12/12" paddingBottom={2}>
          <InputController
            id={infoFieldId}
            name={infoFieldId}
            label={formatMessage(m.moneyAndDepositText)}
            placeholder={formatMessage(m.moneyAndDepositPlaceholder)}
            textarea
            rows={7}
            backgroundColor="blue"
          />
        </GridColumn>
        <GridColumn span={['12/12', '6/12']} paddingBottom={2}>
          <InputController
            id={valueFieldId}
            name={valueFieldId}
            label={formatMessage(m.moneyAndDepositValue)}
            placeholder="0 kr."
            backgroundColor="blue"
            currency
          />
        </GridColumn>
      </GridRow>
    </Box>
  )
}

export default MoneyAndDepositFields
