import { FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'

import { m } from '../../lib/messages'
import { getEstateDataFromApplication } from '../../lib/utils'

export const InventoryFields: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
  field,
}) => {
  const { id } = field
  const { formatMessage } = useLocale()
  const { setValue, getValues } = useFormContext()
  const estateData = getEstateDataFromApplication(application)
  const [hasInitialized, setHasInitialized] = useState(false)

  const infoFieldId = `${id}.info`
  const valueFieldId = `${id}.value`

  useEffect(() => {
    // Only pre-populate once if fields are empty
    if (
      !hasInitialized &&
      estateData.estate &&
      (estateData.estate as any).inventory
    ) {
      const currentInfo = getValues(infoFieldId)
      const currentValue = getValues(valueFieldId)

      // Only set values if fields are currently empty
      if (!currentInfo && !currentValue) {
        const { info, value } = (estateData.estate as any).inventory
        if (info) {
          setValue(infoFieldId, info)
        }
        if (value) {
          setValue(valueFieldId, value)
        }
      }
      setHasInitialized(true)
    }
  }, [
    estateData,
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
            label={formatMessage(m.inventoryTextField)}
            placeholder={formatMessage(m.inventoryTextFieldPlaceholder)}
            textarea
            rows={7}
            backgroundColor="blue"
          />
        </GridColumn>
        <GridColumn span={['12/12', '6/12']} paddingBottom={2}>
          <InputController
            id={valueFieldId}
            name={valueFieldId}
            label={formatMessage(m.inventoryValueTitle)}
            placeholder="0 kr."
            backgroundColor="blue"
            currency
          />
        </GridColumn>
      </GridRow>
    </Box>
  )
}

export default InventoryFields
