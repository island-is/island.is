import { FC, useEffect, useCallback, useState } from 'react'
import { MessageDescriptor } from 'react-intl'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import { FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  GridColumn,
  GridRow,
  Button,
  Text,
} from '@island.is/island-ui/core'

import { m } from '../../lib/messages'
import { getEstateDataFromApplication } from '../../lib/utils'
import { ErrorValue } from '../../types'
import { RepeaterTotal } from '../RepeaterTotal'
import { useRepeaterTotal } from '../../hooks/useRepeaterTotal'

interface OtherAssetFormField {
  id: string
  description?: string
  value?: string
  initial?: boolean
  enabled?: boolean
}

interface OtherAssetsRepeaterProps {
  field: {
    props: {
      repeaterButtonText: MessageDescriptor
    }
  }
}

export const OtherAssetsRepeater: FC<
  React.PropsWithChildren<FieldBaseProps & OtherAssetsRepeaterProps>
> = ({ application, field, errors }) => {
  const { id } = field
  const repeaterButtonText = field?.props?.repeaterButtonText
  const error = (errors as ErrorValue)?.estate?.otherAssets
  const { formatMessage } = useLocale()
  const { fields, append, remove, update, replace } = useFieldArray({
    name: id,
  })
  const { control, clearErrors, getValues } = useFormContext()
  const [, updateState] = useState<unknown>()
  const forceUpdate = useCallback(() => updateState({}), [])

  const { total, calculateTotal } = useRepeaterTotal(
    id,
    getValues,
    fields,
    (field: OtherAssetFormField) => field.value,
  )

  useEffect(() => {
    const estateData = getEstateDataFromApplication(application)
    if (fields.length === 0 && estateData.estate?.otherAssets) {
      replace(estateData.estate.otherAssets)
    }
  }, [application, fields.length, replace])

  // Clear errors when other asset value changes
  const updateOtherAssetValue = (fieldIndex: string) => {
    const raw: string | undefined = getValues(`${fieldIndex}.value`)
    const normalized = (raw ?? '')
      .replace(/\./g, '')
      .replace(',', '.')
      .replace(/[^\d.-]/g, '')
    const amount = parseFloat(normalized)

    if (!isNaN(amount) && amount > 0) {
      clearErrors(`${fieldIndex}.value`)
    }

    forceUpdate()
    calculateTotal()
  }

  const handleAddOtherAsset = () =>
    append({
      description: '',
      value: '',
      initial: false,
      enabled: true,
    })

  const handleRemoveOtherAsset = (index: number) => remove(index)

  // Calculate values for all fields when they are populated
  useEffect(() => {
    if (fields.length > 0) {
      fields.forEach((_, index) => {
        const fieldIndex = `${id}[${index}]`
        updateOtherAssetValue(fieldIndex)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields.length, fields])

  return (
    <Box marginTop={2}>
      {fields.map((field: OtherAssetFormField, index) => {
        const fieldIndex = `${id}[${index}]`
        const descriptionField = `${fieldIndex}.description`
        const valueField = `${fieldIndex}.value`
        const initialField = `${fieldIndex}.initial`
        const enabledField = `${fieldIndex}.enabled`
        const fieldError = error && error[index] ? error[index] : null

        return (
          <Box position="relative" key={field.id} marginTop={2}>
            <Controller
              name={initialField}
              control={control}
              defaultValue={field.initial ?? false}
              render={() => <input type="hidden" />}
            />
            <Controller
              name={enabledField}
              control={control}
              defaultValue={field.enabled ?? true}
              render={() => <input type="hidden" />}
            />
            <Box
              display="flex"
              justifyContent="spaceBetween"
              alignItems="center"
              marginBottom={0}
            >
              <Text variant="h4" />
              <Box display="flex" alignItems="center" columnGap={2}>
                {field.initial && (
                  <Button
                    variant="text"
                    icon={field.enabled ? 'remove' : 'add'}
                    size="small"
                    iconType="outline"
                    onClick={() => {
                      const updatedAsset = {
                        ...field,
                        enabled: !field.enabled,
                      }
                      update(index, updatedAsset)
                      clearErrors(`${id}[${index}].value`)
                    }}
                  >
                    {field.enabled
                      ? formatMessage(m.inheritanceDisableMember)
                      : formatMessage(m.inheritanceEnableMember)}
                  </Button>
                )}
                {!field.initial && (
                  <Button
                    variant="ghost"
                    size="small"
                    circle
                    icon="remove"
                    onClick={handleRemoveOtherAsset.bind(null, index)}
                  />
                )}
              </Box>
            </Box>
            <GridRow>
              <GridColumn
                span={['1/1', '1/2']}
                paddingBottom={2}
                paddingTop={2}
              >
                <InputController
                  id={descriptionField}
                  name={descriptionField}
                  label={formatMessage(m.otherAssetsText)}
                  backgroundColor="blue"
                  defaultValue={field.description}
                  error={fieldError?.description}
                  size="sm"
                  disabled={field.initial && !field.enabled}
                  onChange={() => updateOtherAssetValue(fieldIndex)}
                />
              </GridColumn>
              <GridColumn
                span={['1/1', '1/2']}
                paddingBottom={2}
                paddingTop={2}
              >
                <InputController
                  id={valueField}
                  name={valueField}
                  label={formatMessage(m.otherAssetsValue)}
                  defaultValue={field.value}
                  placeholder="0 kr."
                  error={fieldError?.value}
                  currency
                  size="sm"
                  backgroundColor="blue"
                  disabled={field.initial && !field.enabled}
                  onChange={() => updateOtherAssetValue(fieldIndex)}
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
          onClick={handleAddOtherAsset}
          size="small"
        >
          {formatMessage(repeaterButtonText)}
        </Button>
      </Box>
      <RepeaterTotal id={id} total={total} show={!!fields.length} />
    </Box>
  )
}

export default OtherAssetsRepeater
