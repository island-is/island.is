import { FormSystemPermissionType } from '@island.is/api/schema'
import { Box } from '@island.is/island-ui/core'
import { Dispatch, SetStateAction } from 'react'
import { Permission } from './Permission'

interface Props {
  organizationId: string
  selectedPermissions: string[]
  permissionsList: FormSystemPermissionType[]
  setSelectedPermissionsState: Dispatch<SetStateAction<string[]>>
}

export const PermissionsList = ({
  organizationId,
  selectedPermissions,
  permissionsList,
  setSelectedPermissionsState,
}: Props) => {
  permissionsList = permissionsList.sort(
    (a, b) => Number(a.isCommon) - Number(b.isCommon),
  )
  return (
    <>
      <Box paddingTop={4} />
      {permissionsList.map((permission) => (
        <Permission
          key={permission.id}
          organizationId={organizationId}
          setSelectedPermissionsState={setSelectedPermissionsState}
          permission={permission}
          isSelected={
            permission.id ? selectedPermissions.includes(permission.id) : false
          }
        />
      ))}
    </>
  )
}
