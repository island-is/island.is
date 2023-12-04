import { FC, useCallback, useEffect } from 'react'
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
import { MessageDescriptor } from 'react-intl'
import { useLocale } from '@island.is/localization'

type Field = {
  id: string
  title: MessageDescriptor | string
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

const valueKeys = ['rateOfExchange', 'faceValue']

export const TextFieldsRepeater: FC<
  React.PropsWithChildren<FieldBaseProps<Answers> & Props>
> = ({ field, errors }) => {
  const { id, props } = field
  const { fields, append, remove, replace } = useFieldArray({
    name: id,
  })
  const { setValue, getValues, clearErrors } = useFormContext()
  const { formatMessage } = useLocale()

  const handleAddRepeaterFields = useCallback(() => {
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
  }, [append, fields.length, props.fields, replace])

  useEffect(() => {
    if (fields.length === 0) {
      handleAddRepeaterFields()
    }
  }, [fields.length, handleAddRepeaterFields])

  const updateValue = (fieldIndex: string) => {
    const stockValues: { faceValue?: string; rateOfExchange?: string } =
      getValues(fieldIndex)

    let total

    const faceValue = stockValues?.faceValue
    const rateOfExchange = stockValues?.rateOfExchange

    if (faceValue && rateOfExchange) {
      const a = faceValue.replace(/[^\d]/g, '')
      const b = rateOfExchange.replace(/[^\d.,]/g, '').replace(',', '.')

      total = Math.round(parseFloat(a) * parseFloat(b))

      setValue(`${fieldIndex}.value`, String(total))

      if (total > 0) {
        clearErrors(`${fieldIndex}.value`)
      }
    }
  }

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
                  {formatMessage(props.repeaterHeaderText)}
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
              {props.fields.map((field: Field, idx) => {
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
                      label={formatMessage(field.title)}
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
                        if (valueKeys.includes(field.id)) {
                          updateValue(fieldIndex)
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
          {formatMessage(props.repeaterButtonText)}
        </Button>
      </Box>
    </Box>
  )
}

export default TextFieldsRepeater
