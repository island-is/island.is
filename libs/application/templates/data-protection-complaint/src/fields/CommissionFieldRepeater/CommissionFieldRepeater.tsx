import React, { FC, useEffect } from 'react'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { InputController } from '@island.is/shared/form-fields'
import {
  Box,
  Text,
  GridColumn,
  GridRow,
  Button,
} from '@island.is/island-ui/core'
import { useFieldArray } from 'react-hook-form'
import * as styles from './CommissionFieldRepeater.treat'
import { info } from '../../lib/messages'

type PersonField = {
  name: string
  nationalId: string
}

export const CommissionFieldRepeater: FC<FieldBaseProps> = ({
  application,
  errors,
  field,
}) => {
  const { id, title } = field
  const { formatMessage } = useLocale()
  const { fields, append, remove } = useFieldArray<PersonField>({ name: id })

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
        return (
          <Box position="relative" key={field.id} marginTop={3}>
            {index > 0 && (
              <Box position="absolute" className={styles.removeFieldButton}>
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
                  id={`${id}[${index}].name`}
                  name={`${id}[${index}].name`}
                  label={formatText(
                    info.labels.name,
                    application,
                    formatMessage,
                  )}
                  error={errors && (errors[`${id}[${index}].name`] as string)}
                  backgroundColor="blue"
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/2']}>
                <InputController
                  id={`${id}[${index}].nationalId`}
                  name={`${id}[${index}].nationalId`}
                  label={formatText(
                    info.labels.nationalId,
                    application,
                    formatMessage,
                  )}
                  error={
                    errors && (errors[`${id}[${index}].nationalId`] as string)
                  }
                  backgroundColor="blue"
                />
              </GridColumn>
            </GridRow>
          </Box>
        )
      })}
      <Box marginTop={3}>
        <Text marginBottom={3}>
          {formatText(
            info.labels.commissionsAddMoreDescription,
            application,
            formatMessage,
          )}
        </Text>
        <Button
          variant="ghost"
          icon="add"
          iconType="outline"
          onClick={handleAddPerson}
          size="small"
        >
          {formatText(
            info.labels.commissionsAddMoreButtonLabel,
            application,
            formatMessage,
          )}
        </Button>
      </Box>
    </Box>
  )
}
