import { FC } from 'react'
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

export const PersonalAllowance: FC<FieldBaseProps> = ({
  application,
  field,
}) => {
  const { errors, setValue } = useFormContext()
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
              dataTestId: 'use-personal-finance',
              value: YES,
            },
            {
              label: parentalLeaveFormMessages.shared.noOptionLabel,
              dataTestId: 'dont-use-personal-finance',
              value: NO,
            },
          ],
          onSelect: (s: string) => {
            const allowance =
              id === 'usePersonalAllowance'
                ? 'personalAllowance'
                : 'personalAllowanceFromSpouse'

            if (s === NO) {
              // useAsMuchAsPossible set to YES so the user can go forward, because if user first selects
              // YES in usePersonalAllowance then NO without selecting in useAsMuchAsPossible,
              // the user cannot go forward but doesn't see the error message from useAsMuchAsPossible.
              setValue(allowance + '.useAsMuchAsPossible', YES)
            }
          },
        }}
      />
    </Box>
  )
}
