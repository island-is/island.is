import { FC, useState, useEffect } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { InputController } from '@island.is/shared/form-fields'
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
import { TaxFreeLimit } from '../../lib/constants'
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

export const ReportFieldsRepeater: FC<
  FieldBaseProps<Answers> & RepeaterProps
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

  const handleAddRepeaterFields = () => {
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

  /* ------ Set stocks value ------ */
  useEffect(() => {
    setValue(`${index}.value`, String(faceValue * rateOfExchange))
  }, [faceValue, index, rateOfExchange, setValue])

  /* ------ Set heirs calculations ------ */
  useEffect(() => {
    setTaxFreeInheritance(TaxFreeLimit * percentage)
    setInheritance(
      (Number(getValueViaPath(answers, 'assets.assetsTotal')) -
        Number(getValueViaPath(answers, 'debts.debtsTotal')) +
        Number(getValueViaPath(answers, 'business.businessTotal')) -
        Number(getValueViaPath(answers, 'totalDeduction'))) *
        percentage,
    )
    setTaxableInheritance(inheritance - taxFreeInheritance)
    setInheritanceTax(Math.round(taxableInheritance * 0.01))

    setValue(`${index}.taxFreeInheritance`, taxFreeInheritance)
    setValue(`${index}.inheritance`, inheritance)
    setValue(`${index}.inheritanceTax`, Math.round(taxableInheritance * 0.01))
    setValue(`${index}.taxableInheritance`, taxableInheritance)
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
    if (props.fromExternalData && fields.length === 0) {
      append(
        (externalData.syslumennOnEntry?.data as any).estate[
          props.fromExternalData
        ],
      )
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

  return (
    <Box>
      {fields.map((repeaterField, index) => {
        const fieldIndex = `${id}[${index}]`
        return (
          <Box position="relative" key={repeaterField.id} marginTop={4}>
            <Box>
              <Text variant="h4" marginBottom={2}>
                {props.repeaterHeaderText + ' ' + (index + 1)}
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
                    <InputController
                      id={`${fieldIndex}.${field.id}`}
                      name={`${fieldIndex}.${field.id}`}
                      defaultValue={
                        repeaterField[field.id]
                          ? repeaterField[field.id]
                          : field.id === 'taxFreeInheritance'
                          ? taxFreeInheritance
                          : field.id === 'inheritance'
                          ? inheritance
                          : field.id === 'taxableInheritance'
                          ? taxableInheritance
                          : field.id === 'inheritanceTax'
                          ? inheritanceTax
                          : ''
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
                        // heirs
                        if (field.id === 'heirsPercentage') {
                          setPercentage(Number(elem.target.value) / 100)
                        }

                        // stocks
                        if (field.id === 'rateOfExchange') {
                          setRateOfExchange(Number(elem.target.value))
                        } else if (field.id === 'faceValue') {
                          setFaceValue(Number(elem.target.value))
                        }

                        // total
                        if (props.sumField === field.id) {
                          calculateTotal(
                            currencyStringToNumber(elem.target.value),
                            index,
                          )
                        }
                        setIndex(fieldIndex)
                      }}
                    />
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
