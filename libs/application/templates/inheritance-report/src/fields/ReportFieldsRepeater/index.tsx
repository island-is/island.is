import { FC, useState, useEffect, useCallback } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import {
  InputController,
  SelectController,
} from '@island.is/shared/form-fields'
import { FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  GridColumn,
  GridRow,
  Button,
  Input,
} from '@island.is/island-ui/core'
import { Answers } from '../../types'
import * as styles from '../styles.css'
import { getValueViaPath } from '@island.is/application/core'
import { formatCurrency } from '@island.is/application/ui-components'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

type RepeaterProps = {
  field: {
    props: {
      fields: Array<object>
      repeaterButtonText: string
      sumField: string
      fromExternalData?: string
    }
  }
}

function setIfValueIsNotNan(
  setValue: (id: string, value: string | number) => void,
  fieldId: string,
  value: string | number,
) {
  if (typeof value === 'number' && isNaN(value)) {
    return
  }
  setValue(fieldId, value)
}

const valueKeys = ['rateOfExchange', 'faceValue']

export const ReportFieldsRepeater: FC<
  React.PropsWithChildren<FieldBaseProps<Answers> & RepeaterProps>
> = ({ application, field, errors }) => {
  const { answers, externalData } = application

  const { id, props } = field
  const splitId = id.split('.')

  const error =
    errors && errors[splitId[0]]
      ? (errors[splitId[0]] as any)[splitId[1]]?.data ||
        (errors[splitId[0]] as any)?.total
      : undefined

  const { fields, append, remove } = useFieldArray<any>({
    name: id,
  })

  const { setValue, getValues, clearErrors } = useFormContext()
  const { formatMessage } = useLocale()
  const taxFreeLimit = Number(
    formatMessage(m.taxFreeLimit).replace(/[^0-9]/, ''),
  )

  /* ------ Stocks ------ */
  const [rateOfExchange, setRateOfExchange] = useState(0)
  const [faceValue, setFaceValue] = useState(0)
  const [index, setIndex] = useState('0')

  /* ------ Heirs ------ */
  const [percentage, setPercentage] = useState(0)
  const [taxFreeInheritance, setTaxFreeInheritance] = useState(0)
  const [inheritance, setInheritance] = useState(0)
  const [taxableInheritance, setTaxableInheritance] = useState(0)
  const [inheritanceTax, setInheritanceTax] = useState(0)

  /* ------ Total ------ */
  const [total, setTotal] = useState(0)
  const calculateTotal = useCallback(() => {
    const values = getValues(id)
    if (!values) {
      return
    }

    const total = values.reduce(
      (acc: number, current: any) =>
        Number(acc) + Number(current[props.sumField]),
      0,
    )
    const addTotal = id.replace('data', 'total')
    setValue(addTotal, total)

    setTotal(total)
  }, [getValues, id, props.sumField])

  useEffect(() => {
    calculateTotal()
  }, [calculateTotal])

  const relations =
    (externalData.syslumennOnEntry?.data as any).relationOptions?.map(
      (relation: any) => ({
        value: relation,
        label: relation,
      }),
    ) || []

  const handleAddRepeaterFields = () => {
    //reset stocks
    setRateOfExchange(0)
    setFaceValue(0)

    const values = props.fields.map((field: object) => {
      return Object.values(field)[1]
    })

    const repeaterFields: Record<string, string> = values.reduce(
      (acc: Record<string, string>, elem: string) => {
        acc[elem] = ''
        return acc
      },
      {},
    )

    append(repeaterFields)
  }

  const updateValue = (fieldIndex: string) => {
    const stockValues: { faceValue?: string; rateOfExchange?: string } =
      getValues(fieldIndex)

    const faceValue = stockValues?.faceValue
    const rateOfExchange = stockValues?.rateOfExchange

    const a = faceValue?.replace(/[^\d.]/g, '') || '0'
    const b = rateOfExchange?.replace(/[^\d.]/g, '') || '0'

    const aVal = parseFloat(a)
    const bVal = parseFloat(b)

    if (!aVal || !bVal) {
      setValue(`${fieldIndex}.value`, '')
      calculateTotal()
      return
    }

    const total = aVal * bVal
    const totalString = total.toFixed(0)

    setValue(`${fieldIndex}.value`, totalString)

    if (total > 0) {
      clearErrors(`${fieldIndex}.value`)
    }

    calculateTotal()
  }

  /* ------ Set stocks value and total ------ */
  useEffect(() => {
    if (rateOfExchange > 0 && faceValue > 0) {
      setValue(`${index}.value`, String(faceValue * rateOfExchange))

      calculateTotal()
    }
  }, [faceValue, index, rateOfExchange, setValue])

  /* ------ Set heirs calculations ------ */
  useEffect(() => {
    setTaxFreeInheritance(Math.round(taxFreeLimit * percentage))
    setInheritance(
      Math.round(
        (Number(getValueViaPath(answers, 'assets.assetsTotal')) -
          Number(getValueViaPath(answers, 'debts.debtsTotal')) +
          Number(getValueViaPath(answers, 'business.businessTotal')) -
          Number(getValueViaPath(answers, 'totalDeduction'))) *
          percentage,
      ),
    )
    setTaxableInheritance(Math.round(inheritance - taxFreeInheritance))
    setInheritanceTax(Math.round(taxableInheritance * 0.1))

    setIfValueIsNotNan(
      setValue,
      `${index}.taxFreeInheritance`,
      taxFreeInheritance,
    )
    setIfValueIsNotNan(setValue, `${index}.inheritance`, inheritance)
    setIfValueIsNotNan(
      setValue,
      `${index}.inheritanceTax`,
      Math.round(taxableInheritance * 0.01),
    )
    setIfValueIsNotNan(
      setValue,
      `${index}.taxableInheritance`,
      taxableInheritance,
    )
  }, [
    index,
    percentage,
    taxFreeInheritance,
    inheritance,
    taxableInheritance,
    inheritanceTax,
    setValue,
    answers,
  ])

  /* ------ Set fields from external data (realEstate, vehicles) ------ */
  useEffect(() => {
    const extData = (externalData.syslumennOnEntry?.data as any).estate[
      props.fromExternalData ? props.fromExternalData : ''
    ]

    if (props.fromExternalData && fields.length === 0 && extData.length) {
      append(extData)
    }
  }, [props, fields, append])

  const getDefaults = (fieldId: string) => {
    return fieldId === 'taxFreeInheritance'
      ? taxFreeInheritance
      : fieldId === 'inheritance'
      ? inheritance
      : fieldId === 'taxableInheritance'
      ? taxableInheritance
      : fieldId === 'inheritanceTax'
      ? inheritanceTax
      : ''
  }

  return (
    <Box>
      {fields.map((repeaterField: any, index) => {
        const fieldIndex = `${id}[${index}]`
        return (
          <Box position="relative" key={repeaterField.id} marginTop={4}>
            <Box>
              <Box position="absolute" className={styles.removeFieldButton}>
                <Button
                  variant="ghost"
                  size="small"
                  circle
                  icon="remove"
                  onClick={() => {
                    remove(index)
                    calculateTotal()
                  }}
                />
              </Box>
            </Box>
            <GridRow>
              {props.fields.map((field: any) => {
                return (
                  <GridColumn
                    span={
                      field.width === 'full' ? ['1/1', '1/1'] : ['1/1', '1/2']
                    }
                    paddingBottom={2}
                    key={field.id}
                  >
                    {field.id === 'relation' ? (
                      <SelectController
                        id={`${fieldIndex}.${field.id}`}
                        name={`${fieldIndex}.${field.id}`}
                        label={field.title}
                        placeholder={field.placeholder}
                        options={relations}
                      />
                    ) : (
                      <InputController
                        id={`${fieldIndex}.${field.id}`}
                        name={`${fieldIndex}.${field.id}`}
                        defaultValue={
                          repeaterField[field.id]
                            ? repeaterField[field.id]
                            : getDefaults(field.id)
                        }
                        format={field.format}
                        label={field.title}
                        placeholder={field.placeholder}
                        backgroundColor={field.color ? field.color : 'blue'}
                        currency={field.currency}
                        readOnly={field.readOnly}
                        type={field.type}
                        textarea={field.variant}
                        rows={field.rows}
                        required={field.required}
                        error={
                          error && error[index]
                            ? error[index][field.id]
                            : undefined
                        }
                        onChange={(elem) => {
                          const value = elem.target.value.replace(/\D/g, '')

                          // heirs
                          if (field.id === 'heirsPercentage') {
                            setPercentage(Number(value) / 100)
                          }

                          if (valueKeys.includes(field.id)) {
                            updateValue(fieldIndex)
                          }

                          if (props.sumField === field.id) {
                            calculateTotal()
                          }

                          setIndex(fieldIndex)
                        }}
                      />
                    )}
                  </GridColumn>
                )
              })}
            </GridRow>
          </Box>
        )
      })}
      <Box marginTop={3}>
        <Button
          variant="text"
          icon="add"
          iconType="outline"
          onClick={handleAddRepeaterFields}
          size="small"
        >
          {props.repeaterButtonText}
        </Button>
      </Box>
      {!!fields.length && props.sumField && (
        <Box marginTop={5}>
          <GridRow>
            <GridColumn span={['1/1', '1/2']}>
              <Input
                id={`${id}.total`}
                name={`${id}.total`}
                value={
                  props.sumField === 'heirsPercentage'
                    ? String(total) + ' / 100%'
                    : formatCurrency(String(total))
                }
                label={
                  props.sumField === 'heirsPercentage'
                    ? formatMessage(m.totalPercentage)
                    : formatMessage(m.total)
                }
                backgroundColor="white"
                readOnly
                hasError={
                  (props.sumField === 'heirsPercentage' &&
                    error &&
                    total !== 100) ??
                  false
                }
                errorMessage={formatMessage(m.totalPercentageError)}
              />
            </GridColumn>
          </GridRow>
        </Box>
      )}
    </Box>
  )
}

export default ReportFieldsRepeater
