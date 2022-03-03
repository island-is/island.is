import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'

import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import { Box,Input } from '@island.is/island-ui/core'

import { MissingInfoType } from '../../types'

const HiddenDateField: FC<FieldBaseProps> = ({ application }) => {
  const { register } = useFormContext()
  const missingInfo =
    (getValueViaPath(
      application.answers,
      'missingInfo',
    ) as MissingInfoType[]) || []

  let index = 0

  if (missingInfo.length > 0) {
    index = missingInfo.length
  }

  return (
    <Box hidden>
      <Input
        id={`missingInfo[${index}].date`}
        name={`missingInfo[${index}].date`}
        defaultValue={`${new Date()}`}
        ref={register}
      />
    </Box>
  )
}

export default HiddenDateField
