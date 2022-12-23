import { FC, useState } from 'react'
import { useFieldArray } from 'react-hook-form'
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

type Props = {
  field: {
    props: {
      fields: Array<object>
      repeaterButtonText: string
      repeaterHeaderText: string
      sumField: string
    }
  }
}

export const currencyStringToNumber = (str: string) => {
  if (!str) {
    return str
  }
  const cleanString = str.replace(/[,\s]+|[.\s]+/g, '')
  return parseInt(cleanString, 10)
}

export const TextFieldsRepeater: FC<FieldBaseProps<Answers> & Props> = ({
  application,
  field,
}) => {
  const { id, props } = field
  const { fields, append, remove } = useFieldArray<any>({
    name: id,
  })

  const answersValues = getValueViaPath(
    application.answers,
    id,
  ) as Array<object>
  const answersValuesTotal = answersValues?.length
    ? answersValues.reduce((a: number, o: any) => {
        return a + Number(o[props.sumField])
      }, 0)
    : 0

  const [total, setTotal] = useState(
    answersValues?.length ? answersValuesTotal : 0,
  )
  const [valueArray, setValueArray] = useState<Array<number>>(
    answersValues?.length
      ? answersValues.map((v: any) => Number(v[props.sumField]))
      : [],
  )

  const getTheTotalOfTheValues = (v: any, index: any) => {
    const arr = valueArray
    if (arr[index]) {
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

  return (
    <Box>
      {fields.map((repeaterField, index) => {
        const fieldIndex = `${id}[${index}]`

        return (
          <Box
            position="relative"
            key={repeaterField.id}
            marginTop={3}
            hidden={repeaterField.initial || repeaterField?.dummy}
          >
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
                      defaultValue={repeaterField[field.id] || ''}
                      format={field.format}
                      label={field.title}
                      placeholder={field.placeholder}
                      backgroundColor={field.color ? field.color : 'blue'}
                      currency={field.currency}
                      readOnly={field.readOnly}
                      type={field.type}
                      textarea={field.variant}
                      rows={field.rows}
                      onChange={(e) =>
                        props.sumField === field.id
                          ? getTheTotalOfTheValues(
                              currencyStringToNumber(e.target.value),
                              index,
                            )
                          : ''
                      }
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
      <Box marginTop={5}>
        <GridRow>
          <GridColumn span={['1/1', '1/2']}>
            <Input
              id={`${id}.total`}
              name={`${id}.total`}
              value={total ? formatCurrency(String(total)) : '0'}
              label={'Samtals'}
              backgroundColor={'white'}
              readOnly={true}
            />
          </GridColumn>
        </GridRow>
      </Box>
    </Box>
  )
}

export default TextFieldsRepeater
