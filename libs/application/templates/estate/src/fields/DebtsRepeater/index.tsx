/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useState, useEffect, useCallback } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import {
  InputController,
  SelectController,
} from '@island.is/shared/form-fields'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, GridRow, Button, Input } from '@island.is/island-ui/core'
import { getErrorViaPath } from '@island.is/application/core'
import { formatCurrency } from '@island.is/application/ui-components'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import DoubleColumnRow from '../DoubleColumnRow'
import { getEstateDataFromApplication } from '../../lib/utils'
import { valueToNumber } from '../../lib/utils'

type RepeaterProps = {
  field: {
    props: {
      fields: Array<Record<string, unknown>>
      repeaterButtonText: string
      sumField: string
      fromExternalData?: string
      selections?: Array<{ value: string; label: string }>
    }
  }
}

export const DebtsRepeater: FC<
  React.PropsWithChildren<FieldBaseProps & RepeaterProps>
> = ({ application, field, errors }) => {
  const { id, props } = field

  const { fields, append, remove, replace, update } = useFieldArray<any>({
    name: id,
  })

  const { setValue, getValues } = useFormContext()
  const { formatMessage } = useLocale()

  const [total, setTotal] = useState(0)

  const calculateTotal = useCallback(() => {
    const values = getValues(id)
    if (!values) {
      return
    }

    const total = values.reduce((acc: number, current: any) => {
      const currentValue = valueToNumber(
        current.enabled ? current[props?.sumField] : 0,
        ',',
      )
      return Number(acc) + currentValue
    }, 0)

    const addTotal = id.replace('data', 'total')
    setValue(addTotal, total.toString())
    setTotal(total)
  }, [getValues, id, props.sumField, setValue])

  useEffect(() => {
    calculateTotal()
  }, [fields, calculateTotal])

  const debtTypes = props.selections ?? []

  const handleAddRepeaterFields = () => {
    const fieldIds = props.fields.map((f) => (f as any).id)
    const repeaterFields = Object.fromEntries(
      [...fieldIds, 'enabled'].map((key) => [
        key,
        key === 'enabled' ? true : '',
      ]),
    )
    append(repeaterFields)
  }

  /* ------ Set fields from external data ------ */
  useEffect(() => {
    const estateData = getEstateDataFromApplication(application)
    const extData: Array<any> =
      estateData.estate && props.fromExternalData
        ? (estateData.estate as any)[props.fromExternalData] ?? []
        : []

    if (
      extData.length &&
      !(application?.answers as any)?.modifiers?.[props?.fromExternalData ?? '']
        ?.hasModified &&
      fields.length === 0
    ) {
      replace(extData)
      setValue(`modifiers.${props?.fromExternalData}.hasModified`, true)
    }
  }, [application, fields.length, props.fromExternalData, replace, setValue])

  const handleClick = (field: any, index: number) => {
    if (field.initial) {
      const updatedField = {
        ...field,
        enabled: !field.enabled,
      }
      update(index, updatedField)
    } else {
      remove(index)
    }
    calculateTotal()
  }

  return (
    <Box>
      {fields.map((repeaterField: any, mainIndex) => {
        const fieldIndex = `${id}[${mainIndex}]`
        return (
          <Box position="relative" key={repeaterField.id} marginTop={4}>
            <Box display="flex" justifyContent="flexEnd" marginBottom={2}>
              <Button
                variant="text"
                size="small"
                icon={
                  repeaterField.initial
                    ? repeaterField.enabled
                      ? 'remove'
                      : 'add'
                    : 'trash'
                }
                onClick={() => handleClick(repeaterField, mainIndex)}
              >
                {repeaterField.initial
                  ? repeaterField.enabled
                    ? formatMessage(m.disable)
                    : formatMessage(m.activate)
                  : formatMessage(m.delete)}
              </Button>
            </Box>
            <GridRow>
              {props.fields.map((field: any, index) => {
                const even = props.fields.length % 2 === 0
                const lastIndex = props.fields.length - 1
                const pushRight = !even && index === lastIndex

                const fieldId = `${fieldIndex}.${field.id}`
                const err = errors && getErrorViaPath(errors, fieldId)

                const shouldRecalculateTotal = props.sumField === field.id

                return (
                  <DoubleColumnRow
                    span={
                      field.width === 'full' ? ['1/1', '1/1'] : ['1/1', '1/2']
                    }
                    pushRight={pushRight}
                    paddingBottom={2}
                    key={field.id}
                  >
                    {field.id === 'debtType' ? (
                      <SelectController
                        id={`${fieldIndex}.${field.id}`}
                        name={`${fieldIndex}.${field.id}`}
                        defaultValue={repeaterField[field.id] || ''}
                        label={
                          field.title
                            ? formatMessage(field.title as any) || ''
                            : ''
                        }
                        placeholder={
                          field.placeholder
                            ? formatMessage(field.placeholder as any) || ''
                            : ''
                        }
                        options={debtTypes.map((type) => ({
                          label: type.label
                            ? formatMessage(type.label as any) || type.value
                            : type.value,
                          value: type.value,
                        }))}
                        size="sm"
                        backgroundColor="blue"
                        disabled={!repeaterField.enabled}
                        error={err}
                      />
                    ) : (
                      <InputController
                        id={`${fieldIndex}.${field.id}`}
                        name={`${fieldIndex}.${field.id}`}
                        defaultValue={
                          repeaterField[field.id] ? repeaterField[field.id] : ''
                        }
                        format={field.format}
                        label={formatMessage(field.title as any)}
                        placeholder={field.placeholder}
                        backgroundColor={field.color ? field.color : 'blue'}
                        currency={field.currency}
                        type={field.type !== 'nationalId' ? field.type : 'text'}
                        textarea={field.variant}
                        rows={field.rows}
                        required={field.required}
                        error={err}
                        size="sm"
                        disabled={!repeaterField.enabled}
                        onChange={() => {
                          if (shouldRecalculateTotal) {
                            calculateTotal()
                          }
                        }}
                      />
                    )}
                  </DoubleColumnRow>
                )
              })}
            </GridRow>
          </Box>
        )
      })}
      <Box marginTop={2}>
        <Button
          variant="text"
          icon="add"
          iconType="outline"
          onClick={handleAddRepeaterFields}
          size="small"
        >
          {formatMessage(props.repeaterButtonText)}
        </Button>
      </Box>
      {!!fields.length && props.sumField && (
        <Box marginTop={5}>
          <GridRow>
            <DoubleColumnRow
              right={
                <Input
                  id={`${id}.total`}
                  name={`${id}.total`}
                  value={formatCurrency(String(isNaN(total) ? 0 : total))}
                  label={formatMessage(m.total)}
                  backgroundColor="white"
                  readOnly
                />
              }
            />
          </GridRow>
        </Box>
      )}
    </Box>
  )
}

export default DebtsRepeater
