import React, { FC } from 'react'
import { formatText, getErrorViaPath } from '@island.is/application/core'
import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { Box, Text } from '@island.is/island-ui/core'
import { RadioFormField } from '@island.is/application/ui-fields'
import { getOtherParentOptions } from '../../lib/parentalLeaveUtils'
import { SPOUSE, NO, SINGLE } from '../../constants'
import { useFormContext } from 'react-hook-form'

export const OtherParent: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
  field,
}) => {
  const { id, title } = field
  const {
    formState: { errors },
    setValue,
  } = useFormContext()
  const { formatMessage } = useLocale()

  return (
    <Box>
      <Text variant="h4" as="h4">
        {formatText(title, application, formatMessage)}
      </Text>
      <RadioFormField
        error={errors && getErrorViaPath(errors, id)}
        field={{
          id: id,
          type: FieldTypes.RADIO,
          component: FieldComponents.RADIO,
          title,
          children: undefined,
          options: (application) =>
            getOtherParentOptions(application, formatMessage),
          onSelect: async (s: string) => {
            if (s === SPOUSE || s === NO || s === SINGLE) {
              setValue('otherParentObj.otherParentName', '')
              setValue('otherParentObj.otherParentId', '')
            }
          },
        }}
        application={application}
      />
    </Box>
  )
}
