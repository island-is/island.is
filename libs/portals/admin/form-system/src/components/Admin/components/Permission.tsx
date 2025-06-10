import { useContext } from "react"
import { FormsContext } from "../../../context/FormsContext"
import { Box, Checkbox, GridRow, Stack } from '@island.is/island-ui/core'
import { useMutation } from "@apollo/client"
import { CREATE_ORGANIZATION_PERMISSION, DELETE_ORGANIZATION_PERMISSION } from '@island.is/form-system/graphql'
import { id } from "date-fns/locale"

type PermissionType = 'certificate' | 'list' | 'field'

interface Props {
  type: PermissionType
}

export const Permission = ({ type }: Props) => {
  const {
    certficationTypes,
    selectedCertificationTypes,
    setSelectedCertificationTypes,
    listTypes,
    selectedListTypes,
    setSelectedListTypes,
    fieldTypes,
    selectedFieldTypes,
    setSelectedFieldTypes,
    organizationId
  } = useContext(FormsContext)

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
    await addPermissionMutation({
      variables: {
        input: {
          updateOrganizationPermissionDto: {
            permission: id,
            organizationId: organizationId,
          }
        }
      }
    })
  }

  const removePermission = async (id: string) => {
    await removePermissionMutation({
      variables: {
        input: {
          updateOrganizationPermissionDto: {
            permission: id,
            organizationId: organizationId,
          },
        },
      },
    })
    setSelectedTypes(getSelectedTypes().filter((type) => type !== id))
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
        return certficationTypes
      case 'list':
        return listTypes
      case 'field':
        return fieldTypes
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
                  if (e) {
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