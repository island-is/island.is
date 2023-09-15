import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'

import { Box, Text } from '@island.is/island-ui/core'
import { getErrorViaPath, formatText } from '@island.is/application/core'
import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { RadioFormField } from '@island.is/application/ui-fields'
import { useLocale } from '@island.is/localization'

import { NO, YES } from '../../constants'
import { parentalLeaveFormMessages } from '../../lib/messages'

export const PersonalUseAsMuchAsPossible: FC<
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
      <Text variant="h4" as="h4">
        {formatText(title, application, formatMessage)}
      </Text>
      <RadioFormField
        error={errors && getErrorViaPath(errors, id)}
        application={application}
        field={{
          id: id,
          title,
          description,
          type: FieldTypes.RADIO,
          component: FieldComponents.RADIO,
          children: undefined,
          width: 'half',
          options: [
            {
              label: parentalLeaveFormMessages.shared.yesOptionLabel,
              dataTestId: 'use-as-much-as-possible',
              value: YES,
            },
            {
              label: parentalLeaveFormMessages.shared.noOptionLabel,
              dataTestId: 'dont-use-as-much-as-possible',
              value: NO,
            },
          ],
          onSelect: (s: string) => {
            if (s === YES) {
              setValue('personalAllowance.usage', '100')
            }
            if (s === NO) {
              setValue('personalAllowance.usage', '1')
            }
          },
        }}
      />
    </Box>
  )
}
