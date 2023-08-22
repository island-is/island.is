import { FC, useState, useEffect } from 'react'
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
  Text,
  Input,
} from '@island.is/island-ui/core'
import { Answers } from '../../types'
import * as styles from '../styles.css'
import { getValueViaPath } from '@island.is/application/core'
import { formatCurrency } from '@island.is/application/ui-components'
import { currencyStringToNumber } from '../../lib/utils/currencyStringToNumber'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

type RepeaterProps = {
  field: {
    props: {
      fields: Array<object>
      repeaterButtonText: string
      repeaterHeaderText: string
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

  const { setValue } = useFormContext()
  const { formatMessage } = useLocale()
  const taxFreeLimit = Number(
    formatMessage(m.taxFreeLimit).replace(/[^0-9]/, ''),
  )
  const answersValues = getValueViaPath(answers, id) as Array<object>

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
  const answersValuesTotal = answersValues?.length
    ? answersValues.reduce((a: number, o: any) => {
        return a + Number(o[props.sumField])
      }, 0)
    : 0

  const [valueArray, setValueArray] = useState<Array<number>>(
    answersValues?.length
      ? answersValues.map((v: any) => Number(v[props.sumField]))
      : [],
  )

  const [total, setTotal] = useState(
    answersValues?.length ? answersValuesTotal : 0,
  )

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

    const repeaterFields = values.reduce((acc: any, elem: any) => {
      acc[elem] = ''
      return acc
    }, {})

    append(repeaterFields)
  }

  /* ------ Set total value ------ */
  useEffect(() => {
    const addTotal = id.replace('data', 'total')
    setValue(addTotal, total)
  }, [id, total, setValue])

  /* ------ Set stocks value and total ------ */
  useEffect(() => {
    if (rateOfExchange > 0 && faceValue > 0) {
      setValue(`${index}.value`, String(faceValue * rateOfExchange))

      const i = index.match(/\d+/)
      calculateTotal(
        currencyStringToNumber(String(Number(rateOfExchange * faceValue))),
        Number((i as any)[0]),
      )
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

  const calculateTotal = (input: any, index: number) => {
    const arr = valueArray
    if (input === '') {
      arr.splice(index, 1)
    } else if (arr[index]) {
      arr.splice(index, 1, input)
      setValueArray(arr)
    } else {
      arr.push(input)
      setValueArray(arr)
    }
    setTotal(
      valueArray.length
        ? valueArray.reduce((sum: number, value: number) => (sum = sum + value))
        : 0,
    )
  }

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
              <Text variant="h4" marginBottom={2}>
                {props.repeaterHeaderText}
              </Text>
              <Box position="absolute" className={styles.removeFieldButton}>
                <Button
                  variant="ghost"
                  size="small"
                  circle
                  icon="remove"
                  onClick={() => {
                    valueArray.splice(index, 1)
                    setTotal(
                      valueArray.length
                        ? valueArray.reduce(
                            (a: number, v: number) => (a = a + v),
                          )
                        : 0,
                    )
                    remove(index)
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

                          // stocks
                          if (field.id === 'rateOfExchange') {
                            setRateOfExchange(Number(value))
                          } else if (field.id === 'faceValue') {
                            setFaceValue(Number(value))
                          }

                          // total
                          if (props.sumField === field.id) {
                            calculateTotal(currencyStringToNumber(value), index)
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
                backgroundColor={'white'}
                readOnly={true}
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
