import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Text } from '@island.is/island-ui/core'
import { getErrorViaPath } from '@island.is/application/core'

// Simply displays any custom validation errors that are directly on the
// fishing license further info object, i.e. not belonging directly to an input box
export const CustomLicensesErrorCheck: FC<FieldBaseProps> = ({ errors }) => {
  const error =
    getErrorViaPath(errors || {}, 'fishingLicenseFurtherInformation') || ''
  if (!error || typeof error !== 'string') {
    return null
  }
  return (
    <Text color="red600" fontWeight="medium">
      {error}
    </Text>
  )
}
