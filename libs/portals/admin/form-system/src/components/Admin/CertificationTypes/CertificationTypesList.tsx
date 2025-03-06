import { FormSystemFormCertificationType } from '@island.is/api/schema'
import { CertificationType } from './CertficationType'
import { Box } from '@island.is/island-ui/core'
import { useState } from 'react'

interface Props {
  selectedCertificationTypes: string[]
  certficationTypes: FormSystemFormCertificationType[]
}

export const CertificationTypesList = ({
  selectedCertificationTypes,
  certficationTypes,
}: Props) => {
  return (
    <>
      {certficationTypes.map((certificationType) => (
        <CertificationType
          key={certificationType.id}
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
