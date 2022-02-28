import React, { FC, useEffect } from 'react'
import { useFieldArray } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import {
  FieldBaseProps,
  formatText,
  getErrorViaPath,
} from '@island.is/application/core'
import {
  Box,
  Text,
  GridColumn,
  GridRow,
  Button,
} from '@island.is/island-ui/core'
import { EstateMember } from '../../types'

export const EstateMemberRepeater: FC<FieldBaseProps> = ({
  application,
  errors,
  field,
}) => {
  const { id, title } = field
  const { formatMessage } = useLocale()
  const { fields, append, remove } = useFieldArray<EstateMember>({ name: id })

  useEffect(() => {
    // The repeater should include one line by default
    if (fields.length === 0) handleAddPerson()
  }, [fields])

  const handleAddPerson = () =>
    append({
      name: '',
      nationalId: '',
    })
  const handleRemovePerson = (index: number) => remove(index)

  return (
    <Box marginTop={5}>
      {fields.map((field, index) => {
        const fieldIndex = `${id}[${index}]`
        const nameField = `${fieldIndex}.name`
        const nationalIdField = `${fieldIndex}.nationalId`
        return (
          <Box position="relative" key={field.id} marginTop={3}>
            {index > 0 && (
              <Box>
                <Button
                  variant="ghost"
                  size="small"
                  circle
                  icon="remove"
                  onClick={handleRemovePerson.bind(null, index)}
                />
              </Box>
            )}
            <Text variant="h4" marginBottom={3}>
              {formatText(title, application, formatMessage)}{' '}
              {index > 0 ? index + 1 : ''}
            </Text>
            <GridRow>
              <GridColumn span={['1/1', '1/2']}>
                <InputController
                  id={nameField}
                  name={nameField}
                  label="bla1"
                  error={errors && getErrorViaPath(errors, nameField)}
                  required
                  backgroundColor="blue"
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/2']}>
                <InputController
                  id={nationalIdField}
                  name={nationalIdField}
                  label="bla2"
                  format="######-####"
                  error={errors && getErrorViaPath(errors, nationalIdField)}
                  required
                  backgroundColor="blue"
                />
              </GridColumn>
            </GridRow>
          </Box>
        )
      })}
      <Box marginTop={3}>
        <Button
          variant="ghost"
          icon="add"
          iconType="outline"
          onClick={handleAddPerson}
          size="small"
        >
          Bæta við
        </Button>
      </Box>
    </Box>
  )
}
