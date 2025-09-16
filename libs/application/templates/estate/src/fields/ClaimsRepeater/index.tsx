import { FC, useEffect, useCallback, useState } from 'react'
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

interface ClaimFormField {
  id: string
  publisher?: string
  value?: string
  nationalId?: string
  initial?: boolean
  enabled?: boolean
}

interface ClaimsRepeaterProps {
  field: {
    props: {
      repeaterButtonText: string
    }
  }
}

export const ClaimsRepeater: FC<
  React.PropsWithChildren<FieldBaseProps & ClaimsRepeaterProps>
> = ({ application, field, errors }) => {
  const { id } = field
  const repeaterButtonText = field?.props?.repeaterButtonText
  const error = (errors as ErrorValue)?.estate?.claims
  const { formatMessage } = useLocale()
  const { fields, append, remove, update, replace } = useFieldArray({
    name: id,
  })
  const { control, clearErrors, setValue, getValues } = useFormContext()
  const estateData = getEstateDataFromApplication(application)
  const [, updateState] = useState<unknown>()
  const forceUpdate = useCallback(() => updateState({}), [])

  useEffect(() => {
    if (fields.length === 0 && estateData.estate?.claims) {
      replace(estateData.estate.claims)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Clear errors when claim value changes
  const updateClaimValue = (fieldIndex: string) => {
    const claimValues = getValues(fieldIndex)
    const value = claimValues?.value?.replace(/[^\d.]/g, '') || '0'

    if (parseFloat(value) > 0) {
      clearErrors(`${fieldIndex}.value`)
    }

    forceUpdate()
  }

  const handleAddClaim = () =>
    append({
      publisher: '',
      value: '',
      nationalId: '',
      initial: false,
      enabled: true,
    })

  const handleRemoveClaim = (index: number) => remove(index)

  // Calculate claimTotal for all fields when they are populated
  useEffect(() => {
    if (fields.length > 0) {
      fields.forEach((_, index) => {
        const fieldIndex = `${id}[${index}]`
        updateClaimValue(fieldIndex)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields.length, fields])

  return (
    <Box marginTop={2}>
      {fields.map((field: ClaimFormField, index) => {
        const fieldIndex = `${id}[${index}]`
        const publisherField = `${fieldIndex}.publisher`
        const valueField = `${fieldIndex}.value`
        const nationalIdField = `${fieldIndex}.nationalId`
        const initialField = `${fieldIndex}.initial`
        const enabledField = `${fieldIndex}.enabled`
        const fieldError = error && error[index] ? error[index] : null

        return (
          <Box position="relative" key={field.id} marginTop={2}>
            <Controller
              name={initialField}
              control={control}
              defaultValue={field.initial || false}
              render={() => <input type="hidden" />}
            />
            <Controller
              name={enabledField}
              control={control}
              defaultValue={field.enabled || true}
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
                      const updatedClaim = {
                        ...field,
                        enabled: !field.enabled,
                      }
                      update(index, updatedClaim)
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
                    onClick={handleRemoveClaim.bind(null, index)}
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
                  id={publisherField}
                  name={publisherField}
                  label={formatMessage(m.claimsPublisher)}
                  backgroundColor="blue"
                  defaultValue={field.publisher}
                  required
                  error={fieldError?.publisher}
                  size="sm"
                  disabled={field.initial && !field.enabled}
                  onChange={() => updateClaimValue(fieldIndex)}
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
                  label={formatMessage(m.claimsAmount)}
                  defaultValue={field.value}
                  placeholder="0 kr."
                  required
                  error={fieldError?.value}
                  currency
                  size="sm"
                  backgroundColor="blue"
                  disabled={field.initial && !field.enabled}
                  onChange={() => updateClaimValue(fieldIndex)}
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                <InputController
                  id={nationalIdField}
                  name={nationalIdField}
                  label={formatMessage(m.nationalId)}
                  defaultValue={field.nationalId}
                  placeholder="000000-0000"
                  error={fieldError?.nationalId}
                  format="######-####"
                  size="sm"
                  backgroundColor="blue"
                  disabled={field.initial && !field.enabled}
                  onChange={() => updateClaimValue(fieldIndex)}
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
          onClick={handleAddClaim}
          size="small"
        >
          {formatMessage(repeaterButtonText)}
        </Button>
      </Box>
    </Box>
  )
}

export default ClaimsRepeater
