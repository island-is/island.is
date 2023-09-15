import React, { FC, useEffect } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { EstateRegistrant } from '@island.is/clients/syslumenn'
import { useFormContext } from 'react-hook-form'

export const AnswerPopulator: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { setValue } = useFormContext()
  useEffect(() => {
    const externalData = application.externalData.syslumennOnEntry.data
    const estateData = (externalData as { estate: EstateRegistrant })?.estate
    if (estateData) {
      setValue('caseNumber', estateData.caseNumber)
      setValue('marriageSettlement', estateData.marriageSettlement)
      setValue(
        'districtCommissionerHasWill',
        estateData.districtCommissionerHasWill,
      )
    }
  }, [])

  return <></>
}
