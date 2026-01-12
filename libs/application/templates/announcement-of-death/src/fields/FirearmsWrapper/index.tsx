import { FieldBaseProps } from '@island.is/application/types'
import { NO } from '@island.is/application/core'
import React, { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

export const FirearmsWrapper: FC<
  React.PropsWithChildren<FieldBaseProps>
> = () => {
  const { watch, setValue } = useFormContext()

  const hadFirearms = watch('hadFirearms')

  useEffect(() => {
    // Clear firearmApplicant data when user selects NO
    if (hadFirearms === NO) {
      setValue('firearmApplicant', undefined)
    }
  }, [hadFirearms, setValue])

  // This component doesn't render anything - it just handles side effects
  return null
}
