import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'

import { Box } from '@island.is/island-ui/core'
import { getErrorViaPath } from '@island.is/application/core'
import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { RadioFormField } from '@island.is/application/ui-fields'

import { NO, YES } from '../../constants'
import { parentalLeaveFormMessages } from '../../lib/messages'

export const SelfEmployed: FC<FieldBaseProps> = ({ application, field }) => {
  const { errors, setValue } = useFormContext()
  const { id, title, description } = field

  return (
    <Box>
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
              value: YES,
            },
            {
              label: parentalLeaveFormMessages.shared.noOptionLabel,
              value: NO,
            },
          ],
          onSelect: (s: string) => {
            if (s === YES) {
              setValue('employer.email', '')
            }
          },
        }}
      />
    </Box>
  )
}
