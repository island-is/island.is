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

import { NO, YES, NO_MULTIPLE_BIRTHS } from '../../constants'
import { parentalLeaveFormMessages } from '../../lib/messages'

export const HasMultipleBirths: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
  field,
}) => {
  const {
    setValue,
    formState: { errors },
  } = useFormContext()
  const { formatMessage } = useLocale()
  const { id, title, description } = field

  return (
    <Box paddingTop={6} aria-labelledby={id} role="region">
      <Text variant="h4" as="h4" id={id}>
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
              dataTestId: 'has-multiple-births',
              value: YES,
            },
            {
              label: parentalLeaveFormMessages.shared.noOptionLabel,
              dataTestId: 'dont-has-multiple-births',
              value: NO,
            },
          ],
          onSelect: (s: string) => {
            if (s === NO) {
              setValue('multipleBirths.multipleBirths', NO_MULTIPLE_BIRTHS)
            }
            if (s === YES) {
              setValue('multipleBirths.multipleBirths', '')
            }
          },
        }}
      />
    </Box>
  )
}
