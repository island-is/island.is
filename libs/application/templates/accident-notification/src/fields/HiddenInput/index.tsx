import { FieldBaseProps } from '@island.is/application/core'
import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'

interface HiddenInformationProps {
  field: {
    props: {
      id: string
    }
  }
}

export const HiddenInput: FC<FieldBaseProps & HiddenInformationProps> = ({
  field,
}) => {
  const { register } = useFormContext()
  const { id } = field.props

  console.log(id)

  return <input type="hidden" value={undefined} ref={register} name={id} />
}
