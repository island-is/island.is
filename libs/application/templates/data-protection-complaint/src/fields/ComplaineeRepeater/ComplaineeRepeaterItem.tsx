import {
  Application,
  formatText,
  FormValue,
  getValueViaPath,
  getErrorViaPath,
  RecordObject,
} from '@island.is/application/core'
import {
  AlertMessage,
  Box,
  Button,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { InputController, RadioController } from '@island.is/shared/form-fields'
import React, { FC, useState } from 'react'
import { useLocale } from '@island.is/localization'
import { complaint, sharedFields } from '../../lib/messages'
import { YES, NO } from '../../shared'
import { ArrayField } from 'react-hook-form'
import * as styles from './ComplaineeRepeater.treat'
import { ComplaineeField } from './ComplaineeRepeater'

interface Props {
  id: string
  application: Application
  field: Partial<ArrayField<ComplaineeField, 'id'>>
  answers: FormValue
  index: number
  handleRemoveComplainee: (index: number) => void
  errors: RecordObject<unknown> | undefined
}

export const ComplaineeRepeaterItem: FC<Props> = ({
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

  const { formatMessage } = useLocale()
  const [isOpen, setIsOpen] = useState(initialIsOpen === YES || false)

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
          defaultValue=""
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
          defaultValue=""
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
          defaultValue=""
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
      />
      {isOpen && (
        <Box padding={3} background="blue100" borderRadius="large">
          <Box marginBottom={2}>
            <InputController
              id={countryOfOperationField}
              name={countryOfOperationField}
              label={formatText(
                complaint.labels.complaineeCountryOfOperation,
                application,
                formatMessage,
              )}
              error={errors && getErrorViaPath(errors, countryOfOperationField)}
              defaultValue=""
            />
          </Box>
          <AlertMessage
            type="info"
            title={formatMessage(
              complaint.labels.complaineeOperatesWithinEuropeMessage,
            )}
          />
        </Box>
      )}
    </Box>
  )
}
