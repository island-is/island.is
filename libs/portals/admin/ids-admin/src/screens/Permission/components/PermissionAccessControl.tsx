import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import isEqual from 'lodash/isEqual'
import { MultiValue } from 'react-select'

import { useLocale } from '@island.is/localization'
import {
  Box,
  Button,
  Checkbox,
  CheckboxProps,
  LoadingDots,
  Select,
  Stack,
} from '@island.is/island-ui/core'

import { usePermission } from '../PermissionContext'
import { FormCard } from '../../../components/FormCard/FormCard'
import { m } from '../../../lib/messages'
import { PermissionFormTypes } from '../EditPermission.schema'
import { useEnvironmentState } from '../../../hooks/useEnvironmentState'
import { checkEnvironmentsSync } from '../../../utils/checkEnvironmentsSync'
import { useSuperAdmin } from '../../../hooks/useSuperAdmin'
import {
  useGetScopeUsersQuery,
  useGetAllApiScopeUsersForSelectQuery,
} from './PermissionAccessControl.generated'
import {
  CreateScopeUserModal,
  type CreatedScopeUser,
} from './CreateScopeUserModal'
import * as styles from './PermissionAccessControl.css'

type UserOption = { label: string; value: string }

const commonProps: Pick<CheckboxProps, 'backgroundColor' | 'large' | 'value'> =
  {
    backgroundColor: 'blue',
    large: true,
    value: 'true',
  }

export const PermissionAccessControl = () => {
  const { formatMessage } = useLocale()
  const { selectedPermission, permission } = usePermission()
  const { isSuperAdmin } = useSuperAdmin()
  const { tenant: tenantId, permission: scopeName } = useParams() as {
    tenant: string
    permission: string
  }
  const {
    isAccessControlled,
    grantToAuthenticatedUser,
    automaticDelegationGrant,
  } = selectedPermission

  const [inputValues, setInputValues] = useEnvironmentState<{
    isAccessControlled: boolean
    grantToAuthenticatedUser: boolean
    automaticDelegationGrant: boolean
  }>({
    isAccessControlled,
    grantToAuthenticatedUser,
    automaticDelegationGrant,
  })

  const [selectedUsers, setSelectedUsers] = useEnvironmentState<
    MultiValue<UserOption>
  >([])
  const [originalUserNationalIds, setOriginalUserNationalIds] =
    useEnvironmentState<string[]>([])
  const [usersDirty, setUsersDirty] = useEnvironmentState(false)
  const [createModalVisible, setCreateModalVisible] = useState(false)

  const showUserSelection = isSuperAdmin && inputValues.isAccessControlled

  // Fetch users assigned to this scope
  const { data: scopeUsersData, loading: scopeUsersLoading } =
    useGetScopeUsersQuery({
      variables: {
        input: {
          tenantId,
          scopeName,
          environment: selectedPermission.environment,
        },
      },
      skip: !showUserSelection,
      fetchPolicy: 'network-only',
    })

  // Fetch all API scope users for the dropdown
  const {
    data: allUsersData,
    loading: allUsersLoading,
    refetch: refetchAllUsers,
  } = useGetAllApiScopeUsersForSelectQuery({
    variables: {
      input: {
        searchString: '',
        page: 1,
        count: 1000,
      },
    },
    skip: !showUserSelection,
  })

  const allUserOptions: UserOption[] = useMemo(
    () =>
      (allUsersData?.authAdminApiScopeUsers?.rows ?? []).map((user) => ({
        label: user.name
          ? `${user.name} - ${user.nationalId}`
          : user.nationalId,
        value: user.nationalId,
      })),
    [allUsersData],
  )

  // Initialize selected users when scope users data loads (not when allUserOptions changes)
  useEffect(() => {
    if (!scopeUsersData?.authAdminScopeUsers) return

    const scopeUserNationalIds = scopeUsersData.authAdminScopeUsers.map(
      (u) => u.nationalId,
    )
    setOriginalUserNationalIds(scopeUserNationalIds)

    const preSelected = scopeUsersData.authAdminScopeUsers.map((u) => ({
      label: u.name ? `${u.name} - ${u.nationalId}` : u.nationalId,
      value: u.nationalId,
    }))

    setSelectedUsers(preSelected)
    setUsersDirty(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopeUsersData])

  const handleUserChange = (value: MultiValue<UserOption>) => {
    setSelectedUsers(value)
    const newIds = [...value].map((v) => v.value).sort()
    const origIds = [...originalUserNationalIds].sort()
    setUsersDirty(!isEqual(newIds, origIds))
  }

  const handleUserCreated = (user: CreatedScopeUser) => {
    const newOption: UserOption = {
      label: user.name ? `${user.name} - ${user.nationalId}` : user.nationalId,
      value: user.nationalId,
    }
    setSelectedUsers((prev) => [...prev, newOption])
    setUsersDirty(true)
    refetchAllUsers()
  }

  // Compute added/removed for form submission
  const selectedNationalIds = useMemo(
    () => selectedUsers.map((u) => u.value),
    [selectedUsers],
  )

  const addedNationalIds = useMemo(
    () =>
      selectedNationalIds.filter((id) => !originalUserNationalIds.includes(id)),
    [selectedNationalIds, originalUserNationalIds],
  )

  const removedNationalIds = useMemo(
    () =>
      originalUserNationalIds.filter((id) => !selectedNationalIds.includes(id)),
    [selectedNationalIds, originalUserNationalIds],
  )

  const customValidation = useCallback(
    (_currentValue: FormData, _originalValue: FormData) => {
      if (!showUserSelection) return false
      return usersDirty
    },
    [showUserSelection, usersDirty],
  )

  const isLoading = scopeUsersLoading || allUsersLoading

  return (
    <FormCard
      title={formatMessage(m.accessControl)}
      intent={PermissionFormTypes.ACCESS_CONTROL}
      inSync={checkEnvironmentsSync(permission.environments, [
        'isAccessControlled',
        'grantToAuthenticatedUser',
        'automaticDelegationGrant',
      ])}
      customValidation={customValidation}
    >
      <div className={styles.userSelectionContainer}>
        {isSuperAdmin && (
          <Checkbox
            label={formatMessage(m.isAccessControlled)}
            subLabel={formatMessage(m.isAccessControlledDescription)}
            name="isAccessControlled"
            checked={inputValues.isAccessControlled}
            onChange={(e) => {
              setInputValues({
                ...inputValues,
                isAccessControlled: e.target.checked,
              })
            }}
            {...commonProps}
          >
            {showUserSelection ? (
              <Stack space={2}>
                {isLoading ? (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <LoadingDots />
                  </Box>
                ) : (
                  <Box display="flex" alignItems="flexEnd" columnGap={2}>
                    <Box style={{ flex: 1 }}>
                      <input
                        type="hidden"
                        name="addedScopeUserNationalIds"
                        value={JSON.stringify(addedNationalIds)}
                      />
                      <input
                        type="hidden"
                        name="removedScopeUserNationalIds"
                        value={JSON.stringify(removedNationalIds)}
                      />
                      <Select
                        value={selectedUsers}
                        options={allUserOptions}
                        label={formatMessage(m.apiScopeUsers)}
                        onChange={(value) => {
                          handleUserChange(value as MultiValue<UserOption>)
                        }}
                        placeholder={formatMessage(m.scopeUsersPlaceholder)}
                        isMulti
                        size="xs"
                      />
                    </Box>
                    <Box paddingTop={1}>
                      <Button
                        variant="utility"
                        size="small"
                        icon="add"
                        onClick={() => setCreateModalVisible(true)}
                      >
                        {formatMessage(m.addScopeUser)}
                      </Button>
                    </Box>
                  </Box>
                )}
                <CreateScopeUserModal
                  visible={createModalVisible}
                  onClose={() => setCreateModalVisible(false)}
                  onCreated={handleUserCreated}
                />
              </Stack>
            ) : undefined}
          </Checkbox>
        )}
        <Checkbox
          label={formatMessage(m.grantToAuthenticatedUser)}
          subLabel={formatMessage(m.grantToAuthenticatedUserDescription)}
          name="grantToAuthenticatedUser"
          checked={inputValues.grantToAuthenticatedUser}
          onChange={(e) => {
            setInputValues({
              ...inputValues,
              grantToAuthenticatedUser: e.target.checked,
            })
          }}
          {...commonProps}
        />
        <Checkbox
          label={formatMessage(m.automaticDelegationGrant)}
          subLabel={formatMessage(m.automaticDelegationGrantDescription)}
          name="automaticDelegationGrant"
          checked={inputValues.automaticDelegationGrant}
          onChange={(e) => {
            setInputValues({
              ...inputValues,
              automaticDelegationGrant: e.target.checked,
            })
          }}
          {...commonProps}
        />
      </div>
    </FormCard>
  )
}
