import { FC, useEffect, useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { InputController } from '@island.is/shared/form-fields'
import { FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  GridColumn,
  GridRow,
  Button,
  Text,
  InputBackgroundColor,
} from '@island.is/island-ui/core'
import { Answers } from '../../types'
import * as styles from '../styles.css'

type Field = {
  id: string
  title: string
  placeholder?: string
  format?: string
  backgroundColor?: InputBackgroundColor
  currency?: boolean
  readOnly?: boolean
  type?: 'text' | 'email' | 'number' | 'tel'
}

type Props = {
  field: {
    props: {
      fields: Field[]
      repeaterButtonText: string
      repeaterHeaderText: string
    }
  }
}

const initialValue = { formatted: '', raw: 0 }

export const TextFieldsRepeater: FC<
  React.PropsWithChildren<FieldBaseProps<Answers> & Props>
> = ({ field, errors }) => {
  const { id, props } = field
  const { fields, append, remove, replace } = useFieldArray({
    name: id,
  })
  const [rateOfExchange, setRateOfExchange] = useState({...initialValue})
  const [faceValue, setFaceValue] = useState({...initialValue})
  const [index, setIndex] = useState('0')

  const { setValue, clearErrors } = useFormContext()

  const makeValues = (value: string): typeof rateOfExchange => {
    const formatted = value.slice()

    let rawValue = value.replace(/[^\d.,]/g, '')
    rawValue = rawValue.replace(',', '.')

    const raw = rawValue ? parseFloat(rawValue) : 0

    return {
      formatted,
      raw: Number.isNaN(raw) ? 0 : raw,
    }
  }

  const handleAddRepeaterFields = () => {
    const values = props.fields.map((field: Field) => {
      return Object.values(field)[1]
    })

    const repeaterFields = values.reduce(
      (acc: Record<string, string>, elem: any) => {
        acc[elem] = ''
        return acc
      },
      {},
    )

    if (fields.length === 0) {
      replace(repeaterFields)
    } else {
      append(repeaterFields)
    }
  }

  useEffect(() => {
    if (fields.length === 0) {
      handleAddRepeaterFields()
    }

    const sum = Math.round(faceValue.raw * rateOfExchange.raw)

    setValue(`${index}.value`, String(sum))

    if (sum > 0) {
      clearErrors(`${index}.value`)
    }
  }, [fields, faceValue, rateOfExchange, setValue])

  return (
    <Box>
      {fields.map((repeaterField: any, index) => {
        const fieldIndex = `${id}[${index}]`

        return (
          <Box
            position="relative"
            key={repeaterField.id}
            marginTop={2}
            hidden={repeaterField.initial}
          >
            {index > 0 && (
              <>
                <Text variant="h4" marginBottom={2}>
                  {props.repeaterHeaderText}
                </Text>
                <Box position="absolute" className={styles.removeFieldButton}>
                  <Button
                    variant="ghost"
                    size="small"
                    circle
                    icon="remove"
                    onClick={() => remove(index)}
                  />
                </Box>
              </>
            )}

            <GridRow>
              {props.fields.map((field: Field) => {
                return (
                  <GridColumn
                    span={['1/1', '1/2']}
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
                      backgroundColor={
                        field.backgroundColor ? field.backgroundColor : 'blue'
                      }
                      currency={field.currency}
                      readOnly={field.readOnly}
                      type={field.type}
                      error={
                        !!errors && errors[id] && (errors[id] as any)[index]
                          ? (errors[id] as any)[index][field.id]
                          : undefined
                      }
                      onChange={(e) => {
                        setIndex(fieldIndex)

                        if (field.id === 'rateOfExchange') {
                          setRateOfExchange(makeValues(e.target.value ?? ''))
                        } else if (field.id === 'faceValue') {
                          setFaceValue(makeValues(e.target.value ?? ''))
                        }
                      }}
                    />
                  </GridColumn>
                )
              })}
            </GridRow>
          </Box>
        )
      })}
      <Box marginTop={1}>
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
    </Box>
  )
}

export default TextFieldsRepeater
