import { FC } from 'react'
import { useFieldArray } from 'react-hook-form'
import { InputController } from '@island.is/shared/form-fields'
import { FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  GridColumn,
  GridRow,
  Button,
  Text,
} from '@island.is/island-ui/core'
import { Answers } from '../../types'
import * as styles from '../styles.css'

type Props = {
  field: {
    props: {
      fields: Array<object>
      repeaterButtonText: string
      repeaterHeaderText: string
    }
  }
}

export const TextFieldsRepeater: FC<FieldBaseProps<Answers> & Props> = ({
  field,
}) => {
  const { id, props } = field
  const { fields, append, remove } = useFieldArray<any>({
    name: id,
  })

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
                  onClick={() => remove(index)}
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
    </Box>
  )
}

export default TextFieldsRepeater
