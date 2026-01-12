import { FC, useEffect } from 'react'
import { useFieldArray, useFormContext, Controller } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, GridColumn, GridRow, Button } from '@island.is/island-ui/core'
import { AssetFormField, ErrorValue } from '../../types'

import { m } from '../../lib/messages'
import { AdditionalRealEstate } from './AdditionalRealEstate'
import { InputController } from '@island.is/shared/form-fields'
import { getEstateDataFromApplication } from '../../lib/utils'
import { RepeaterTotal } from '../RepeaterTotal'
import { useRepeaterTotal } from '../../hooks/useRepeaterTotal'

export const RealEstateRepeater: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application, field, errors }) => {
  const error = (errors as ErrorValue)?.estate?.assets
  const { id } = field
  const { formatMessage } = useLocale()
  const { fields, append, remove, update, replace } = useFieldArray({
    name: id,
  })

  const { clearErrors, getValues, control, trigger, setValue } =
    useFormContext()

  const { total, calculateTotal } = useRepeaterTotal(
    id,
    getValues,
    fields,
    (field: AssetFormField) => field.marketValue,
  )

  useEffect(() => {
    const estateData = getEstateDataFromApplication(application)
    if (fields.length === 0 && estateData.estate?.assets) {
      replace(estateData.estate.assets)
    }
  }, [application, fields.length, replace])

  const handleAddProperty = () =>
    append({
      share: 100,
      assetNumber: '',
      description: '',
      marketValue: '',
      initial: false,
      enabled: true,
    })
  const handleRemoveProperty = (index: number) => remove(index)

  const handleToggleEnabled = (asset: AssetFormField, index: number) => {
    const updatedAsset = {
      ...asset,
      enabled: !asset.enabled,
    }
    update(index, updatedAsset)
    clearErrors(`${id}[${index}].marketValue`)
    calculateTotal()
  }

  return (
    <Box marginTop={2}>
      {fields.map((asset: AssetFormField, index) => {
        const fieldIndex = `${id}[${index}]`
        const fieldError = error && error[index] ? error[index] : null

        // Render additional (user-added) properties with the existing component
        if (!asset.initial) {
          return (
            <AdditionalRealEstate
              key={asset.id}
              field={asset}
              fieldName={id}
              remove={handleRemoveProperty}
              index={index}
              error={fieldError}
              calculateTotal={calculateTotal}
            />
          )
        }

        // Render initial (prefilled) properties with the same layout style as inheritance-report
        return (
          <Box position="relative" key={asset.id} marginTop={4}>
            <Controller
              name={`${fieldIndex}.initial`}
              control={control}
              defaultValue={asset.initial}
              render={() => <input type="hidden" />}
            />
            <Controller
              name={`${fieldIndex}.enabled`}
              control={control}
              defaultValue={asset.enabled}
              render={() => <input type="hidden" />}
            />
            <Box display="flex" justifyContent="flexEnd" marginBottom={2}>
              <Button
                variant="text"
                size="small"
                icon={asset.enabled ? 'remove' : 'add'}
                onClick={() => handleToggleEnabled(asset, index)}
              >
                {asset.enabled
                  ? formatMessage(m.disable)
                  : formatMessage(m.activate)}
              </Button>
            </Box>
            <GridRow>
              <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                <InputController
                  id={`${fieldIndex}.assetNumber`}
                  name={`${fieldIndex}.assetNumber`}
                  label={formatMessage(m.propertyNumber)}
                  backgroundColor="blue"
                  defaultValue={asset.assetNumber}
                  readOnly
                  disabled={!asset.enabled}
                  error={fieldError?.assetNumber}
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                <InputController
                  id={`${fieldIndex}.description`}
                  name={`${fieldIndex}.description`}
                  label={formatMessage(m.address)}
                  defaultValue={asset.description}
                  readOnly
                  disabled={!asset.enabled}
                  error={fieldError?.description}
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/2']}>
                <InputController
                  id={`${fieldIndex}.share`}
                  name={`${fieldIndex}.share`}
                  label={formatMessage(m.propertyShare)}
                  defaultValue={String(asset.share)}
                  type="number"
                  suffix="%"
                  backgroundColor="blue"
                  required
                  disabled={!asset.enabled}
                  error={fieldError?.share}
                  onChange={(e) => {
                    setValue(
                      `${fieldIndex}.share`,
                      Number(e.target.value.replace('%', '')),
                    )
                    calculateTotal()
                    trigger(`${fieldIndex}.share`)
                  }}
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/2']}>
                <InputController
                  id={`${fieldIndex}.marketValue`}
                  name={`${fieldIndex}.marketValue`}
                  label={formatMessage(m.realEstateValueTitle)}
                  placeholder="0 kr."
                  defaultValue={asset.marketValue}
                  error={fieldError?.marketValue}
                  currency
                  backgroundColor="blue"
                  disabled={!asset.enabled}
                  required
                  onChange={() => calculateTotal()}
                />
              </GridColumn>
            </GridRow>
          </Box>
        )
      })}
      <Box marginTop={2}>
        <Button
          variant="text"
          icon="add"
          iconType="outline"
          onClick={handleAddProperty}
          size="small"
        >
          {formatMessage(m.addProperty)}
        </Button>
      </Box>
      <RepeaterTotal id={id} total={total} show={!!fields.length} />
    </Box>
  )
}

export default RealEstateRepeater
