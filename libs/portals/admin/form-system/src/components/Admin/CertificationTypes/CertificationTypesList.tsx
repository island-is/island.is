import { FormSystemFormCertificationType } from '@island.is/api/schema'
import { CertificationType } from './CertficationType'
import { Box } from '@island.is/island-ui/core'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

interface Props {
  organizationId: string
  selectedCertificationTypes: string[]
  certficationTypes: FormSystemFormCertificationType[]
  setSelectedCertificationTypesState: Dispatch<SetStateAction<string[]>>
}

export const CertificationTypesList = ({
  organizationId,
  selectedCertificationTypes,
  certficationTypes,
  setSelectedCertificationTypesState,
}: Props) => {
  return (
    <>
      {certficationTypes.map((certificationType) => (
        <CertificationType
          key={certificationType.id}
          organizationId={organizationId}
          setSelectedCertificationTypesState={
            setSelectedCertificationTypesState
          }
          certificationType={certificationType}
          isSelected={
            certificationType.id
              ? selectedCertificationTypes.includes(certificationType.id)
              : false
          }
        />
      ))}
    </>
  )
}
