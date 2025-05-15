import {
  formatText,
  getErrorViaPath,
  getValueViaPath,
  NO,
  YES,
} from '@island.is/application/core'
import {
  Application,
  FormValue,
  RecordObject,
} from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  Button,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { InputController, RadioController } from '@island.is/shared/form-fields'
import React, { FC, useState, useEffect } from 'react'
import { FieldArrayWithId } from 'react-hook-form'
import { complaint, sharedFields } from '../../lib/messages'
import * as styles from './ComplaineeRepeater.css'
import { useFormContext } from 'react-hook-form'

interface Props {
  id: string
  application: Application
  field: FieldArrayWithId
  answers: FormValue
  index: number
  handleRemoveComplainee: (index: number) => void
  errors: RecordObject<unknown> | undefined
}

export const ComplaineeRepeaterItem: FC<React.PropsWithChildren<Props>> = ({
  id,
  application,
  field,
  answers,
  index,
  handleRemoveComplainee,
  errors,
}) => {
  const fieldIndex = `${id}[${index}]`
  const nameField = `${fieldIndex}.name`
  const addressField = `${fieldIndex}.address`
  const nationalIdField = `${fieldIndex}.nationalId`
  const operatesWithinEuropeField = `${fieldIndex}.operatesWithinEurope`
  const countryOfOperationField = `${fieldIndex}.countryOfOperation`

  const initialIsOpen = getValueViaPath(
    answers,
    operatesWithinEuropeField,
  ) as string

  const { watch, setValue } = useFormContext()
  const { formatMessage } = useLocale()
  const watchCountryOfOperationField = watch(countryOfOperationField, '')
  const [isOpen, setIsOpen] = useState<boolean>(initialIsOpen === YES || false)

  useEffect(() => {
    if (!isOpen && watchCountryOfOperationField.length === 0) {
      setValue(countryOfOperationField, 'temp')
    } else if (isOpen && watchCountryOfOperationField === 'temp') {
      setValue(countryOfOperationField, '')
    }
  }, [isOpen])

  const handleOnSelect = (value: string) => setIsOpen(value === YES)

  return (
    <Box position="relative" key={field.id} marginTop={3}>
      {index > 0 && (
        <Box position="absolute" className={styles.removeFieldButton}>
          <Button
            variant="ghost"
            size="small"
            circle
            icon="remove"
            onClick={handleRemoveComplainee.bind(null, index)}
          />
        </Box>
      )}
      <Stack space={2}>
        <InputController
          id={nameField}
          name={nameField}
          label={formatText(
            complaint.labels.complaineeName,
            application,
            formatMessage,
          )}
          error={errors && getErrorViaPath(errors, nameField)}
          required
          backgroundColor="blue"
          defaultValue={
            getValueViaPath(application.answers, nameField, '') as string
          }
        />
        <InputController
          id={addressField}
          name={addressField}
          label={formatText(
            complaint.labels.complaineeAddress,
            application,
            formatMessage,
          )}
          error={errors && getErrorViaPath(errors, addressField)}
          required
          backgroundColor="blue"
          defaultValue={
            getValueViaPath(application.answers, addressField, '') as string
          }
        />
        <InputController
          id={nationalIdField}
          name={nationalIdField}
          format="######-####"
          label={formatText(
            complaint.labels.complaineeNationalId,
            application,
            formatMessage,
          )}
          error={errors && getErrorViaPath(errors, nationalIdField)}
          backgroundColor="blue"
          defaultValue={
            getValueViaPath(application.answers, nationalIdField, '') as string
          }
        />
      </Stack>
      <Text variant="h5" marginTop={4} marginBottom={2}>
        {formatMessage(complaint.labels.complaineeOperatesWithinEurope)}
      </Text>
      <RadioController
        id={operatesWithinEuropeField}
        name={operatesWithinEuropeField}
        error={errors && getErrorViaPath(errors, operatesWithinEuropeField)}
        largeButtons
        options={[
          { value: YES, label: formatMessage(sharedFields.yes) },
          { value: NO, label: formatMessage(sharedFields.noIdontKnow) },
        ]}
        split="1/2"
        onSelect={handleOnSelect}
        defaultValue={
          (getValueViaPath(
            application.answers,
            operatesWithinEuropeField,
          ) as string) ?? undefined
        }
      />
      <Box
        padding={3}
        background="blue100"
        borderRadius="large"
        hidden={!isOpen}
      >
        <Box marginBottom={2}>
          <InputController
            id={countryOfOperationField}
            name={countryOfOperationField}
            label={formatText(
              complaint.labels.complaineeCountryOfOperation,
              application,
              formatMessage,
            )}
            required
            error={errors && getErrorViaPath(errors, countryOfOperationField)}
            defaultValue={
              getValueViaPath(
                application.answers,
                countryOfOperationField,
                '',
              ) as string
            }
          />
        </Box>
        <AlertMessage
          type="info"
          title={formatMessage(
            complaint.labels.complaineeOperatesWithinEuropeMessage,
          )}
        />
      </Box>
    </Box>
  )
}
