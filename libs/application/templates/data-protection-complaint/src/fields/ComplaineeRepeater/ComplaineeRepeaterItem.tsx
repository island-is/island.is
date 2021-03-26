import {
  Application,
  formatText,
  FormValue,
  getValueViaPath,
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
  const initialIsOpen = getValueViaPath(
    answers,
    `${id}[${index}].operatesWithinEurope`,
  ) as string

  const { formatMessage } = useLocale()
  const [isOpen, setIsOpen] = useState(initialIsOpen === YES || false)

  const handleOnSelect = (value: string) => setIsOpen(value === YES)

  return (
    <Box position="relative" marginTop={3}>
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
          id={`${id}[${index}].name`}
          name={`${id}[${index}].name`}
          label={formatText(
            complaint.labels.complaineeName,
            application,
            formatMessage,
          )}
          error={errors && (errors[`${id}[${index}].name`] as string)}
          backgroundColor="blue"
        />
        <InputController
          id={`${id}[${index}].address`}
          name={`${id}[${index}].address`}
          label={formatText(
            complaint.labels.complaineeAddress,
            application,
            formatMessage,
          )}
          error={errors && (errors[`${id}[${index}].address`] as string)}
          backgroundColor="blue"
        />
        <InputController
          id={`${id}[${index}].nationalId`}
          name={`${id}[${index}].nationalId`}
          format="######-####"
          label={formatText(
            complaint.labels.complaineeNationalId,
            application,
            formatMessage,
          )}
          error={errors && (errors[`${id}[${index}].nationalId`] as string)}
          backgroundColor="blue"
        />
      </Stack>
      <Text variant="h5" marginTop={4} marginBottom={2}>
        {formatMessage(complaint.labels.complaineeOperatesWithinEurope)}
      </Text>
      <RadioController
        id={`${id}[${index}].operatesWithinEurope`}
        name={`${id}[${index}].operatesWithinEurope`}
        error={
          errors && (errors[`${id}[${index}].operatesWithinEurope`] as string)
        }
        largeButtons
        options={[
          { value: YES, label: formatMessage(sharedFields.yes) },
          { value: NO, label: formatMessage(sharedFields.no) },
        ]}
        split="1/2"
        onSelect={handleOnSelect}
      />
      {isOpen && (
        <Box padding={3} background="blue100">
          <Box marginBottom={2}>
            <InputController
              id={`${id}[${index}].countryOfOperation`}
              name={`${id}[${index}].countryOfOperation`}
              label={formatText(
                complaint.labels.complaineeCountryOfOperation,
                application,
                formatMessage,
              )}
              error={
                errors &&
                (errors[`${id}[${index}].countryOfOperation`] as string)
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
      )}
    </Box>
  )
}
