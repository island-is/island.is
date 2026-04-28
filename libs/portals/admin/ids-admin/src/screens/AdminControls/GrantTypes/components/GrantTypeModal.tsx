import React from 'react'

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
import type { GrantTypeModalState } from '../hooks/useGrantTypeModal'

interface GrantTypeModalProps {
  modal: GrantTypeModalState
}

export const GrantTypeModal = ({ modal }: GrantTypeModalProps) => {
  const { formatMessage } = useLocale()

  if (!modal.modalVisible) {
    return null
  }

  return (
    <Modal
      id="grant-type-modal"
      isVisible={modal.modalVisible}
      label={
        modal.isEditing
          ? formatMessage(m.grantTypesEditTitle)
          : formatMessage(m.grantTypesCreateTitle)
      }
      onClose={modal.resetModalState}
      closeButtonLabel={formatMessage(m.grantTypesCancelButton)}
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
              ? formatMessage(m.grantTypesEditTitle)
              : formatMessage(m.grantTypesCreateTitle)}
          </Text>
          {modal.isEditing &&
            (modal.loadingGrantType ? (
              <Box style={{ minWidth: 200 }}>
                <SkeletonLoader height={40} borderRadius="large" />
              </Box>
            ) : (
              <Select
                name="publishEnvironment"
                label={formatMessage(m.environment)}
                options={modal.environmentOptions}
                value={modal.environmentOptions.find(
                  (opt) => opt.value === modal.selectedEnvResult.environment,
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
              name="name"
              label={formatMessage(m.grantTypesName)}
              value={modal.formData.name}
              onChange={(e) => modal.setFormField('name', e.target.value)}
              disabled={modal.isEditing}
              size="sm"
              backgroundColor="blue"
              hasError={!!modal.formErrors.name}
              errorMessage={modal.formErrors.name}
            />
            <Input
              name="description"
              label={formatMessage(m.grantTypesDescription)}
              value={modal.formData.description}
              onChange={(e) =>
                modal.setFormField('description', e.target.value)
              }
              size="sm"
              backgroundColor="blue"
              hasError={!!modal.formErrors.description}
              errorMessage={modal.formErrors.description}
            />

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
              columnGap={2}
            >
              <Button variant="ghost" onClick={modal.resetModalState}>
                {formatMessage(m.grantTypesCancelButton)}
              </Button>
              <Button onClick={modal.handleSubmit} loading={modal.isSubmitting}>
                {modal.isEditing
                  ? formatMessage(m.grantTypesSaveButton)
                  : formatMessage(m.grantTypesCreateButton)}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Modal>
  )
}
