import React, { FC } from 'react'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import { Input, Hidden } from '@island.is/island-ui/core'
import { useFormContext } from 'react-hook-form'

const HiddenDateField: FC<FieldBaseProps> = ({ application }) => {
  const { register } = useFormContext()
  const missingInfo = getValueViaPath(
    application.answers,
    'missingInfo',
  ) as string[]

  let index = 0

  if (missingInfo.length > 0) {
    index = missingInfo.length
  }

  return (
    <Hidden above="xs">
      <Input
        id={`missingInfo[${index}].date`}
        name={`missingInfo[${index}].date`}
        defaultValue={`${new Date()}`}
        ref={register}
      />
    </Hidden>
  )
}

export default HiddenDateField
