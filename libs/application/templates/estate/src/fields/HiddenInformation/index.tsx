import { FieldBaseProps } from '@island.is/application/types'
import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { EstateTypes } from '../../lib/constants'

interface HiddenInformationProps {
  field: {
    props: {
      id: string
    }
  }
}

export const HiddenInformation: FC<
  React.PropsWithChildren<FieldBaseProps & HiddenInformationProps>
> = ({ application, field }) => {
  const { register, setValue } = useFormContext()
  const { id } = field.props

  let failedValidations: string[] = []
  let settlementMessages =
    (
      application.externalData?.syslumennOnEntry?.data as {
        estate: { availableSettlements?: Record<string, string> }
      }
    )?.estate.availableSettlements ?? {}
  for (let [key, value] of Object.entries(settlementMessages)) {
    if (value !== 'Í lagi') {
      failedValidations.push(EstateTypes[key as keyof typeof EstateTypes])
    }
  }

  setValue('availableSettlements', failedValidations.join(','))

  return (
    <>
      <input
        type="hidden"
        {...register(`availableSettlements`, { required: true })}
      />
    </>
  )
}
