import { useMutation } from '@apollo/client'
import {
  FormSystemFormCertificationType,
  FormSystemLanguageType,
  FormSystemPermissionType,
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
  permission: FormSystemPermissionType
  isSelected: boolean
  setSelectedPermissionsState: Dispatch<SetStateAction<string[]>>
}

export const Permission = ({
  organizationId,
  setSelectedPermissionsState,
  permission,
  isSelected,
}: Props) => {
  const [isSelectedState, setIsSelectedState] = useState(isSelected)
  const [addPermission] = useMutation(CREATE_ORGANIZATION_PERMISSION, {
    onCompleted: (newPermissionData) => {
      if (
        newPermissionData?.formSystemCreateOrganizationPermission?.permission
      ) {
        setSelectedPermissionsState((prevPermissions) => [
          ...prevPermissions,
          newPermissionData.formSystemCreateOrganizationPermission?.permission,
        ])
      }
    },
  })

  const [removePermission] = useMutation(DELETE_ORGANIZATION_PERMISSION)

  useEffect(() => {
    setIsSelectedState(isSelected)
  }, [isSelected])
  return (
    <>
      <GridRow>
        <Box marginTop={1}>
          {permission.isCommon ? (
            <ToggleSwitchCheckbox
              name={organizationId + '-' + permission.id}
              label={''}
              checked={true}
              disabled={true}
              onChange={() => {}}
            />
          ) : (
            <ToggleSwitchCheckbox
              name={organizationId + '-' + permission.id}
              label={''}
              checked={isSelectedState}
              onChange={async (e) => {
                setIsSelectedState(e)
                if (e) {
                  await addPermission({
                    variables: {
                      input: {
                        updateOrganizationPermissionDto: {
                          permission: permission.id,
                          organizationId: organizationId,
                        },
                      },
                    },
                  })
                } else {
                  await removePermission({
                    variables: {
                      input: {
                        updateOrganizationPermissionDto: {
                          permission: permission.id,
                          organizationId: organizationId,
                        },
                      },
                    },
                  })
                  setSelectedPermissionsState((prevPermissions) =>
                    prevPermissions.filter(
                      (prevPermission) => prevPermission !== permission.id,
                    ),
                  )
                }
              }}
            />
          )}
        </Box>
        <Box marginLeft={2}>
          <h2>{permission.name?.is}</h2>
        </Box>
      </GridRow>
      <Box paddingBottom={2}></Box>
    </>
  )
}
