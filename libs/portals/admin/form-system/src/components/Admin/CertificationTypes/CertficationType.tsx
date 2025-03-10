import { useMutation } from '@apollo/client'
import {
  FormSystemFormCertificationType,
  FormSystemLanguageType,
} from '@island.is/api/schema'
import {
  CREATE_CERTIFICATION,
  DELETE_CERTIFICATION,
  CREATE_ORGANIZATION_PERMISSION,
  DELETE_ORGANIZATION_PERMISSION,
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
  const [addCertificationType] = useMutation(CREATE_ORGANIZATION_PERMISSION, {
    onCompleted: (newCertificationData) => {
      if (
        newCertificationData?.formSystemCreateOrganizationPermission?.permission
      ) {
        setSelectedCertificationTypesState((prevCertifications) => [
          ...prevCertifications,
          newCertificationData.formSystemCreateOrganizationPermission
            ?.permission,
        ])
      }
    },
  })

  const [removeCertificationType] = useMutation(DELETE_ORGANIZATION_PERMISSION)

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
              if (e) {
                await addCertificationType({
                  variables: {
                    input: {
                      updateOrganizationPermissionDto: {
                        permission: certificationType.id,
                        organizationId: organizationId,
                      },
                    },
                  },
                })
              } else {
                await removeCertificationType({
                  variables: {
                    input: {
                      updateOrganizationPermissionDto: {
                        permission: certificationType.id,
                        organizationId: organizationId,
                      },
                    },
                  },
                })
                setSelectedCertificationTypesState((prevCertifications) =>
                  prevCertifications.filter(
                    (certification) => certification !== certificationType.id,
                  ),
                )
              }
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
