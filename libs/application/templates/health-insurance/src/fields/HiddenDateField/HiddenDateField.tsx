import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Input, Hidden } from '@island.is/island-ui/core'
import { useFormContext } from 'react-hook-form'

const HiddenDateField: FC<FieldBaseProps> = ({ application }) => {
  const { register } = useFormContext()

  return (
    // <Hidden above="xs">
    <Input
      id={'missingInfo.date'}
      name={'missingInfo.date'}
      defaultValue={`${new Date()}`}
      ref={register}
    />
    // </Hidden>
  )
}

export default HiddenDateField
