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
import { Skattleysismörk } from '../../lib/constants'

type TextRepeaterProps = {
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

export const TextFieldsRepeater: FC<
  FieldBaseProps<Answers> & TextRepeaterProps
> = ({ application, field }) => {
  const { id, props } = field
  const { fields, append, remove } = useFieldArray<any>({
    name: id,
  })

  const { setValue } = useFormContext()
  const answersValues = getValueViaPath(
    application.answers,
    id,
  ) as Array<object>

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

  const getTheTotalOfTheValues = (v: any, index: any) => {
    const arr = valueArray
    if (v === '') {
      arr.splice(index, 1)
    } else if (arr[index]) {
      arr.splice(index, 1, v)
      setValueArray(arr)
    } else {
      arr.push(v)
      setValueArray(arr)
    }
    setTotal(
      valueArray.length
        ? valueArray.reduce((a: any, v: any) => (a = a + v))
        : 0,
    )
  }

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
  }, [faceValue, rateOfExchange, setValue])

  /* ------ Set heirs calculations ------ */
  useEffect(() => {
    setTaxFreeInheritance(Skattleysismörk * percentage)
    setInheritance(15000000 * percentage)
    setTaxableInheritance(inheritance - taxFreeInheritance)
    setInheritanceTax((inheritance - taxFreeInheritance) * 0.1)

    setValue(`${index}.taxFreeInheritance`, taxFreeInheritance)
    setValue(`${index}.inheritance`, inheritance)
    setValue(`${index}.taxableInheritance`, taxableInheritance)
    setValue(`${index}.inheritanceTax`, inheritanceTax)
  }, [
    index,
    percentage,
    taxFreeInheritance,
    inheritance,
    taxableInheritance,
    inheritanceTax,
    setValue,
  ])

  /* ------ Set fields from external data (realEstate, vehicles) ------ */
  useEffect(() => {
    if (props.fromExternalData && fields.length === 0) {
      append(
        (application.externalData.syslumennOnEntry?.data as any).estate[
          props.fromExternalData
        ],
      )
    }
  }, [props, fields, append])

  return (
    <Box>
      {fields.map((repeaterField, index) => {
        const fieldIndex = `${id}[${index}]`
        return (
          <Box position="relative" key={repeaterField.id} marginTop={3}>
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
                          ? formatCurrency(String(taxFreeInheritance))
                          : field.id === 'inheritance'
                          ? formatCurrency(String(inheritance))
                          : field.id === 'taxableInheritance'
                          ? formatCurrency(String(taxableInheritance))
                          : field.id === 'inheritanceTax'
                          ? formatCurrency(String(inheritanceTax))
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
                      onChange={(e) => {
                        // heirs
                        if (field.id === 'heirsPercentage') {
                          setPercentage(Number(e.target.value) / 100)
                        }

                        // stocks
                        if (field.id === 'rateOfExchange') {
                          setRateOfExchange(Number(e.target.value))
                        } else if (field.id === 'faceValue') {
                          setFaceValue(Number(e.target.value))
                        }

                        if (props.sumField === field.id) {
                          getTheTotalOfTheValues(
                            currencyStringToNumber(e.target.value),
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
                    ? 'Samtals arfshlutfall'
                    : 'Samtals'
                }
                backgroundColor={'white'}
                readOnly={true}
              />
            </GridColumn>
          </GridRow>
        </Box>
      )}
    </Box>
  )
}

export default TextFieldsRepeater
