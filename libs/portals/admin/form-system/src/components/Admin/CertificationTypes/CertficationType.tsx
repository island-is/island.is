import { useMutation } from '@apollo/client'
import {
  FormSystemFormCertificationType,
  FormSystemLanguageType,
} from '@island.is/api/schema'
import {
  CREATE_CERTIFICATION,
  DELETE_CERTIFICATION,
  CREATE_ORGANIZATION_CERTIFICATION,
} from '@island.is/form-system/graphql'
import {
  Box,
  GridRow,
  ToggleSwitchButton,
  ToggleSwitchCheckbox,
} from '@island.is/island-ui/core'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

interface Props {
  organizationId: string
  certificationType: FormSystemFormCertificationType
  isSelected: boolean
  setSelectedCertificationTypesState: Dispatch<SetStateAction<string[]>>
}

export const CertificationType = ({
  organizationId,
  setSelectedCertificationTypesState,
  certificationType,
  isSelected,
}: Props) => {
  const [isSelectedState, setIsSelectedState] = useState(isSelected)
  const [addCertificationType] = useMutation(
    CREATE_ORGANIZATION_CERTIFICATION,
    {
      onCompleted: (newCertificationData) => {
        if (
          newCertificationData?.formSystemCreateOrganizationCertification
            ?.certificationTypeId
        ) {
          setSelectedCertificationTypesState((prevCertifications) => [
            ...prevCertifications,
            newCertificationData.formSystemCreateOrganizationCertification
              ?.certificationTypeId,
          ])
        }
      },
    },
  )

  // const [removeCertificationType] = useMutation(DELETE_CERTIFICATION, {
  //   onCompleted: (newCertificationData) => {
  //     if (newCertificationData?.formSystemDeleteCertification?.certification) {
  //       setSelectedCertificationTypesState((prevCertifications) =>
  //         prevCertifications.filter(
  //           (certification) =>
  //             certification.id !==
  //             newCertificationData.formSystemDeleteCertification.certification
  //               .id,
  //         ),
  //       )
  //     }
  //   },
  // })
  console.log(certificationType.id, isSelected)
  useEffect(() => {
    setIsSelectedState(isSelected)
  }, [isSelected])
  return (
    <>
      <GridRow>
        <Box marginTop={1}>
          <ToggleSwitchCheckbox
            name={organizationId + '-' + certificationType.id}
            label={''}
            checked={isSelectedState}
            onChange={async (e) => {
              setIsSelectedState(e)
              await addCertificationType({
                variables: {
                  input: {
                    createOrganizationCertificationTypeDto: {
                      certificationTypeId: certificationType.id,
                      organizationId: organizationId,
                    },
                  },
                },
              })
            }}
          />
        </Box>
        <Box marginLeft={2}>
          <h2>{certificationType.name?.is}</h2>
        </Box>
      </GridRow>
      <Box paddingBottom={2}></Box>
    </>
  )
}
