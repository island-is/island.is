import React, { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { PhoneInputController } from '@island.is/shared/form-fields'
import { Box } from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/types'
import { getErrorViaPath } from '@island.is/application/core'

export const PhoneWithElectronicId: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ field, errors }) => {
  const { formatMessage } = useLocale()
  const { id } = field

  return (
    <Box marginTop={2}>
      <PhoneInputController
        id={id}
        label={formatMessage(m.phone)}
        backgroundColor="blue"
        required
        disableDropdown
        error={errors ? getErrorViaPath(errors, id) : undefined}
        /*onChange={() => {
        //trigger electronic id lookup
      }}*/
      />
    </Box>
  )
}
