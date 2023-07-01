import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'

import { Box, Text } from '@island.is/island-ui/core'
import { formatText, getErrorViaPath } from '@island.is/application/core'
import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { RadioFormField } from '@island.is/application/ui-fields'

import { NO, NO_UNEMPLOYED_BENEFITS, YES } from '../../constants'
import { parentalLeaveFormMessages } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

export const UnEmploymentBenefits: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application, field }) => {
  const {
    formState: { errors },
    setValue,
  } = useFormContext()
  const { formatMessage } = useLocale()
  const { id, title, description } = field

  return (
    <Box>
      <Text variant="h2" as="h2">
        {formatText(title, application, formatMessage)}
      </Text>
      <RadioFormField
        error={errors && getErrorViaPath(errors, id)}
        application={application}
        field={{
          id: id,
          title: title,
          description,
          type: FieldTypes.RADIO,
          component: FieldComponents.RADIO,
          children: undefined,
          width: 'half',
          options: [
            {
              label: parentalLeaveFormMessages.shared.yesOptionLabel,
              value: YES,
            },
            {
              label: parentalLeaveFormMessages.shared.noOptionLabel,
              value: NO,
            },
          ],
          onSelect: (s: string) => {
            if (s !== YES) {
              setValue('unemploymentBenefits', NO_UNEMPLOYED_BENEFITS)
              setValue('fileUpload.benefitsFile', null)
            }
            if (s === YES) {
              setValue('unemploymentBenefits', '')
            }
          },
        }}
      />
    </Box>
  )
}
