import { useContext } from 'react'
import { FormsContext } from '../../../context/FormsContext'
import { Box, Checkbox, GridRow, Stack } from '@island.is/island-ui/core'
import { useMutation } from '@apollo/client'
import {
  CREATE_ORGANIZATION_PERMISSION,
  DELETE_ORGANIZATION_PERMISSION,
} from '@island.is/form-system/graphql'
import { FormSystemPermissionType } from '@island.is/api/schema'

type PermissionType = 'certificate' | 'list' | 'field'

interface Props {
  type: PermissionType
}

export const Permission = ({ type }: Props) => {
  const {
    certificationTypes,
    selectedCertificationTypes,
    setSelectedCertificationTypes,
    listTypes,
    selectedListTypes,
    setSelectedListTypes,
    fieldTypes,
    selectedFieldTypes,
    setSelectedFieldTypes,
    organizationNationalId,
  } = useContext(FormsContext)

  const sortedPermissionsList = (list: FormSystemPermissionType[]) => {
    if (!list) return []
    return list.sort((a, b) => Number(a.isCommon) - Number(b.isCommon))
  }

  const [addPermissionMutation] = useMutation(CREATE_ORGANIZATION_PERMISSION, {
    onCompleted: (newPermissionData) => {
      if (
        newPermissionData?.createFormSystemOrganizationPermission?.permission
      ) {
        const currentTypes = getSelectedTypes()
        setSelectedTypes([
          ...currentTypes,
          newPermissionData.createFormSystemOrganizationPermission?.permission,
        ])
      }
    },
  })

  const [removePermissionMutation] = useMutation(DELETE_ORGANIZATION_PERMISSION)

  const addPermission = async (id: string) => {
    try {
      await addPermissionMutation({
        variables: {
          input: {
            updateOrganizationPermissionDto: {
              permission: id,
              organizationNationalId: organizationNationalId,
            },
          },
        },
      })
    } catch (error) {
      throw new Error(`Failed to add permission: ${error}`)
    }
  }

  const removePermission = async (id: string) => {
    try {
      await removePermissionMutation({
        variables: {
          input: {
            updateOrganizationPermissionDto: {
              permission: id,
              organizationNationalId: organizationNationalId,
            },
          },
        },
      })
      setSelectedTypes(getSelectedTypes().filter((type) => type !== id))
    } catch (error) {
      throw new Error(`Failed to remove permission: ${error}`)
    }
  }

  const getSelectedTypes = () => {
    switch (type) {
      case 'certificate':
        return selectedCertificationTypes
      case 'list':
        return selectedListTypes
      case 'field':
        return selectedFieldTypes
      default:
        return []
    }
  }

  const getTypes = () => {
    switch (type) {
      case 'certificate':
        return sortedPermissionsList(certificationTypes)
      case 'list':
        return sortedPermissionsList(listTypes)
      case 'field':
        return sortedPermissionsList(fieldTypes)
      default:
        return []
    }
  }

  const setSelectedTypes = (types: string[]) => {
    switch (type) {
      case 'certificate':
        setSelectedCertificationTypes(types)
        break
      case 'list':
        setSelectedListTypes(types)
        break
      case 'field':
        setSelectedFieldTypes(types)
        break
      default:
        break
    }
  }

  const isSelected = (id: string) => {
    return getSelectedTypes().includes(id)
  }

  return (
    <Box marginTop={4}>
      <Stack space={2}>
        {getTypes().map((permission) => {
          if (permission.isCommon) {
            return (
              <GridRow key={permission.id}>
                <Checkbox
                  key={permission.id}
                  name={permission?.name?.is ?? ''}
                  checked={true}
                  label={permission?.name?.is ?? ''}
                  disabled={true}
                />
              </GridRow>
            )
          }
          return (
            <GridRow key={permission.id}>
              <Checkbox
                key={permission.id}
                name={permission?.name?.is ?? ''}
                checked={isSelected(permission.id ?? '')}
                onChange={async (e) => {
                  if (e.target.checked) {
                    await addPermission(permission.id ?? '')
                  } else {
                    await removePermission(permission.id ?? '')
                  }
                }}
                label={permission?.name?.is ?? ''}
              />
            </GridRow>
          )
        })}
      </Stack>
    </Box>
  )
}
