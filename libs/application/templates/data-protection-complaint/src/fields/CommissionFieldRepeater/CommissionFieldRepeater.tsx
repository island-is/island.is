import React, { FC, useEffect } from 'react'
import { useLocale } from '@island.is/localization'
import {
  formatText,
  formatTextWithLocale,
  getErrorViaPath,
} from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { InputController } from '@island.is/shared/form-fields'
import {
  Box,
  Text,
  GridColumn,
  GridRow,
  Button,
} from '@island.is/island-ui/core'
import { useFieldArray } from 'react-hook-form'
import * as styles from './CommissionFieldRepeater.css'
import { info } from '../../lib/messages'
import { Locale } from '@island.is/shared/types'

export const CommissionFieldRepeater: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application, errors, field }) => {
  const { id, title = '' } = field
  const { formatMessage, lang: locale } = useLocale()
  const { fields, append, remove } = useFieldArray({ name: id })

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
              {formatTextWithLocale(
                title,
                application,
                locale as Locale,
                formatMessage,
              )}{' '}
              {index > 0 ? index + 1 : ''}
            </Text>
            <GridRow>
              <GridColumn span={['1/1', '1/2']}>
                <InputController
                  id={nameField}
                  name={nameField}
                  label={formatText(
                    info.labels.name,
                    application,
                    formatMessage,
                  )}
                  error={errors && getErrorViaPath(errors, nameField)}
                  required
                  backgroundColor="blue"
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/2']}>
                <InputController
                  id={nationalIdField}
                  name={nationalIdField}
                  label={formatText(
                    info.labels.nationalId,
                    application,
                    formatMessage,
                  )}
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
