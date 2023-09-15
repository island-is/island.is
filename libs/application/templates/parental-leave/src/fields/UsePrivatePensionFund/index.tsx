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

import { NO, YES, NO_PRIVATE_PENSION_FUND } from '../../constants'
import { parentalLeaveFormMessages } from '../../lib/messages'

export const UsePrivatePensionFund: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application, field }) => {
  const {
    formState: { errors },
    setValue,
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
          id,
          title,
          description,
          type: FieldTypes.RADIO,
          component: FieldComponents.RADIO,
          children: undefined,
          width: 'half',
          options: [
            {
              label: parentalLeaveFormMessages.shared.yesOptionLabel,
              dataTestId: 'use-private-pension-fund',
              value: YES,
            },
            {
              label: parentalLeaveFormMessages.shared.noOptionLabel,
              dataTestId: 'dont-use-private-pension-fund',
              value: NO,
            },
          ],
          onSelect: (s: string) => {
            if (s === NO) {
              setValue('payments.privatePensionFund', NO_PRIVATE_PENSION_FUND)
              setValue('payments.privatePensionFundPercentage', '0')
            }
            if (s === YES) {
              setValue('payments.privatePensionFund', '')
              setValue('payments.privatePensionFundPercentage', '')
            }
          },
        }}
      />
    </Box>
  )
}
