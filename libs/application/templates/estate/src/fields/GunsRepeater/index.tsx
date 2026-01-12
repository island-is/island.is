import { FC, useEffect } from 'react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, GridColumn, GridRow, Button } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { getEstateDataFromApplication } from '../../lib/utils'
import { AssetFormField, GunsRepeaterProps, ErrorValue } from '../../types'
import { RepeaterTotal } from '../RepeaterTotal'
import { useRepeaterTotal } from '../../hooks/useRepeaterTotal'

export const GunsRepeater: FC<
  React.PropsWithChildren<FieldBaseProps & GunsRepeaterProps>
> = ({ application, field, errors }) => {
  const { id } = field
  const texts = field?.props?.texts
  const assetName = field?.props?.assetName
  const error = (errors as ErrorValue)?.estate?.[assetName]
  const { formatMessage } = useLocale()
  const { fields, append, remove, update, replace } = useFieldArray({
    name: id,
  })
  const { control, clearErrors, getValues } = useFormContext()

  const { total, calculateTotal } = useRepeaterTotal(
    id,
    getValues,
    fields,
    (field: AssetFormField) => field.marketValue,
  )

  useEffect(() => {
    const estateData = getEstateDataFromApplication(application)
    if (fields.length === 0 && estateData.estate?.[assetName]) {
      replace(estateData.estate[assetName])
    }
  }, [application, fields.length, replace, assetName])

  const handleAddAsset = () =>
    append({
      assetNumber: '',
      description: '',
      marketValue: '',
    })
  const handleRemoveAsset = (index: number) => remove(index)

  const handleToggleEnabled = (asset: AssetFormField, index: number) => {
    const isEnabled = asset.enabled !== false
    const updatedAsset = {
      ...asset,
      enabled: !isEnabled,
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

        // Render additional (user-added) assets
        if (!asset.initial) {
          const assetNumberField = `${fieldIndex}.assetNumber`
          const assetTypeField = `${fieldIndex}.description`
          const initialField = `${fieldIndex}.initial`
          const enabledField = `${fieldIndex}.enabled`
          const marketValueField = `${fieldIndex}.marketValue`

          return (
            <Box position="relative" key={asset.id} marginTop={4}>
              <Controller
                name={initialField}
                control={control}
                defaultValue={asset.initial || false}
                render={() => <input type="hidden" />}
              />
              <Controller
                name={enabledField}
                control={control}
                defaultValue={true}
                render={() => <input type="hidden" />}
              />
              <Box display="flex" justifyContent="flexEnd">
                <Button
                  variant="ghost"
                  size="small"
                  circle
                  icon="remove"
                  onClick={handleRemoveAsset.bind(null, index)}
                />
              </Box>
              <GridRow>
                <GridColumn
                  span={['1/1', '1/2']}
                  paddingBottom={2}
                  paddingTop={2}
                >
                  <InputController
                    id={assetNumberField}
                    name={assetNumberField}
                    label={formatMessage(texts.assetNumber)}
                    backgroundColor="blue"
                    required
                    defaultValue={asset.assetNumber}
                    error={fieldError?.assetNumber}
                  />
                </GridColumn>
                <GridColumn
                  span={['1/1', '1/2']}
                  paddingBottom={2}
                  paddingTop={2}
                >
                  <InputController
                    id={assetTypeField}
                    name={assetTypeField}
                    label={formatMessage(texts.assetType)}
                    defaultValue={asset.description}
                    placeholder=""
                    required
                    error={fieldError?.description}
                    backgroundColor="blue"
                  />
                </GridColumn>
                <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                  <InputController
                    id={marketValueField}
                    name={marketValueField}
                    label={formatMessage(m.marketValueTitle)}
                    defaultValue={asset.marketValue}
                    placeholder="0 kr."
                    error={fieldError?.marketValue}
                    currency
                    required
                    backgroundColor="blue"
                    onChange={() => calculateTotal()}
                  />
                </GridColumn>
              </GridRow>
            </Box>
          )
        }

        // Render initial (prefilled) assets with the same layout style as inheritance-report
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
              {(() => {
                const isEnabled = asset.enabled !== false
                return (
                  <Button
                    variant="text"
                    size="small"
                    icon={isEnabled ? 'remove' : 'add'}
                    onClick={() => handleToggleEnabled(asset, index)}
                  >
                    {isEnabled
                      ? formatMessage(m.disable)
                      : formatMessage(m.activate)}
                  </Button>
                )
              })()}
            </Box>
            {(() => {
              const isEnabled = asset.enabled !== false
              return (
                <GridRow>
                  <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                    <InputController
                      id={`${fieldIndex}.assetNumber`}
                      name={`${fieldIndex}.assetNumber`}
                      label={formatMessage(texts.assetNumber)}
                      backgroundColor="blue"
                      defaultValue={asset.assetNumber}
                      readOnly
                      disabled={!isEnabled}
                      error={fieldError?.assetNumber}
                    />
                  </GridColumn>
                  <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                    <InputController
                      id={`${fieldIndex}.description`}
                      name={`${fieldIndex}.description`}
                      label={formatMessage(texts.assetType)}
                      defaultValue={asset.description}
                      readOnly
                      disabled={!isEnabled}
                      error={fieldError?.description}
                    />
                  </GridColumn>
                  <GridColumn span={['1/1', '1/2']}>
                    <InputController
                      id={`${fieldIndex}.marketValue`}
                      name={`${fieldIndex}.marketValue`}
                      label={formatMessage(m.marketValueTitle)}
                      placeholder="0 kr."
                      defaultValue={asset.marketValue}
                      error={fieldError?.marketValue}
                      currency
                      backgroundColor="blue"
                      disabled={!isEnabled}
                      required
                      onChange={() => calculateTotal()}
                    />
                  </GridColumn>
                </GridRow>
              )
            })()}
          </Box>
        )
      })}
      <Box marginTop={2}>
        <Button
          variant="text"
          icon="add"
          iconType="outline"
          onClick={handleAddAsset}
          size="small"
        >
          {formatMessage(texts.addAsset)}
        </Button>
      </Box>
      <RepeaterTotal id={id} total={total} show={!!fields.length} />
    </Box>
  )
}

export default GunsRepeater
