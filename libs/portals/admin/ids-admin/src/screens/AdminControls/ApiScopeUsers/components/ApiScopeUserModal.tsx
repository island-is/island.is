import React from 'react'
import type { MultiValue } from 'react-select'

import { AuthAdminEnvironment } from '@island.is/api/schema'
import {
  Box,
  Button,
  Checkbox,
  Input,
  InputError,
  Select,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Modal } from '@island.is/react/components'

import { m } from '../../../../lib/messages'
import { authAdminEnvironments } from '../../../../utils/environments'
import type { ApiScopeUserModalState } from '../hooks/useApiScopeUserModal'
import type { ScopeOption } from '../ApiScopeUsers.types'

interface ApiScopeUserModalProps {
  modal: ApiScopeUserModalState
}

export const ApiScopeUserModal = ({ modal }: ApiScopeUserModalProps) => {
  const { formatMessage } = useLocale()

  if (!modal.modalVisible) {
    return null
  }

  return (
    <Modal
      id="api-scope-user-modal"
      isVisible={modal.modalVisible}
      label={
        modal.isEditing
          ? formatMessage(m.apiScopeUsersEditTitle)
          : formatMessage(m.apiScopeUsersCreateTitle)
      }
      onClose={modal.resetModalState}
      closeButtonLabel={formatMessage(m.closeModal)}
      scrollType="outside"
    >
      <Box paddingX={4}>
        <Box
          display="flex"
          justifyContent="spaceBetween"
          alignItems="center"
          marginBottom={4}
        >
          <Text variant="h2" as="h2">
            {modal.isEditing
              ? formatMessage(m.apiScopeUsersEditTitle)
              : formatMessage(m.apiScopeUsersCreateTitle)}
          </Text>
          {modal.isEditing &&
            (modal.loadingUser ? (
              <Box style={{ minWidth: 200 }}>
                <SkeletonLoader height={40} borderRadius="large" />
              </Box>
            ) : (
              <Select
                name="publishEnvironment"
                label={formatMessage(m.environment)}
                options={modal.environmentOptions}
                value={modal.environmentOptions.find(
                  (opt) =>
                    opt.value ===
                    (modal.editEnvironment ??
                      modal.selectedEnvResult.environment),
                )}
                size="sm"
                backgroundColor="blue"
                isDisabled={modal.isPublishing}
                onChange={(opt) => {
                  if (!opt) return
                  const env = opt.value as AuthAdminEnvironment
                  modal.handleEnvironmentSwitch(env)
                }}
              />
            ))}
        </Box>

        <Box marginBottom={3}>
          <Stack space={3}>
            <Input
              name="nationalId"
              label={formatMessage(m.apiScopeUsersNationalId)}
              value={modal.formData.nationalId}
              onChange={(e) => modal.setFormField('nationalId', e.target.value)}
              disabled={modal.isEditing}
              size="sm"
              backgroundColor="blue"
              hasError={!!modal.formErrors.nationalId}
              errorMessage={modal.formErrors.nationalId}
            />
            <Input
              name="name"
              label={formatMessage(m.apiScopeUsersName)}
              value={modal.formData.name}
              onChange={(e) => modal.setFormField('name', e.target.value)}
              size="sm"
              backgroundColor="blue"
              hasError={!!modal.formErrors.name}
              errorMessage={modal.formErrors.name}
            />
            <Input
              name="email"
              label={formatMessage(m.apiScopeUsersEmail)}
              value={modal.formData.email}
              onChange={(e) => modal.setFormField('email', e.target.value)}
              size="sm"
              backgroundColor="blue"
              hasError={!!modal.formErrors.email}
              errorMessage={modal.formErrors.email}
            />

            {modal.accessControlledScopes.length > 0 && (
              <Box>
                {modal.loadingUser || modal.loadingScopes ? (
                  <Text>{formatMessage(m.apiScopeUsersScopesLoading)}</Text>
                ) : (
                  <Select
                    label={formatMessage(m.apiScopeUsersScopes)}
                    value={modal.selectedScopeOptions}
                    options={modal.activeScopeOptions}
                    onChange={(value) => {
                      modal.handleScopeChange(value as MultiValue<ScopeOption>)
                    }}
                    isMulti
                    size="sm"
                    backgroundColor="blue"
                  />
                )}
              </Box>
            )}

            {!modal.isEditing && (
              <Box marginTop={3}>
                <Text variant="h4" marginBottom={2}>
                  {formatMessage(m.chooseEnvironment)}
                </Text>
                <Box
                  display="flex"
                  flexDirection={['column', 'row']}
                  columnGap={3}
                  rowGap={2}
                >
                  {authAdminEnvironments.map((env) => (
                    <Box width="full" key={env}>
                      <Checkbox
                        label={env}
                        name="environments"
                        id={`environments.${env}`}
                        value={env}
                        checked={modal.selectedEnvironments.includes(env)}
                        onChange={() =>
                          modal.handleEnvironmentCheckboxChange(env)
                        }
                        disabled={!modal.configuredEnvironments.includes(env)}
                        large
                      />
                    </Box>
                  ))}
                </Box>
                {modal.formErrors.environments && (
                  <InputError
                    id="environments-error"
                    errorMessage={modal.formErrors.environments}
                  />
                )}
              </Box>
            )}
            <Box
              paddingTop={4}
              display="flex"
              justifyContent="spaceBetween"
              alignItems="center"
              columnGap={2}
            >
              <Button variant="ghost" onClick={modal.resetModalState}>
                {formatMessage(m.cancel)}
              </Button>
              <Box display="flex" alignItems="center" columnGap={3}>
                {modal.isEditing &&
                  modal.userAvailableEnvironments.length > 1 && (
                    <Checkbox
                      label={formatMessage(m.saveForAllEnvironments)}
                      name="saveOnAllEnvironments"
                      checked={modal.saveOnAllEnvs}
                      onChange={modal.toggleSaveOnAllEnvs}
                    />
                  )}
                <Button
                  onClick={modal.handleSubmit}
                  loading={modal.isSubmitting}
                  disabled={
                    modal.loadingUser ||
                    modal.loadingScopes ||
                    modal.isPublishing
                  }
                >
                  {modal.isEditing
                    ? formatMessage(m.save)
                    : formatMessage(m.create)}
                </Button>
              </Box>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Modal>
  )
}
