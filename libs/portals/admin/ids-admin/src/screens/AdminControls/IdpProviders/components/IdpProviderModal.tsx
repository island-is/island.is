import React from 'react'

import { AuthAdminEnvironment } from '@island.is/api/schema'
import {
  Box,
  Button,
  Checkbox,
  Input,
  InputError,
  LoadingDots,
  Select,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Modal } from '@island.is/react/components'

import { m } from '../../../../lib/messages'
import { authAdminEnvironments } from '../../../../utils/environments'
import type { IdpProviderModalState } from '../hooks/useIdpProviderModal'

interface IdpProviderModalProps {
  modal: IdpProviderModalState
}

export const IdpProviderModal = ({ modal }: IdpProviderModalProps) => {
  const { formatMessage } = useLocale()

  if (!modal.modalVisible) {
    return null
  }

  return (
    <Modal
      id="idp-provider-modal"
      isVisible={modal.modalVisible}
      label={
        modal.isEditing
          ? formatMessage(m.idpProvidersEditTitle)
          : formatMessage(m.idpProvidersCreateTitle)
      }
      onClose={modal.resetModalState}
      closeButtonLabel={formatMessage(m.cancel)}
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
              ? formatMessage(m.idpProvidersEditTitle)
              : formatMessage(m.idpProvidersCreateTitle)}
          </Text>
          {modal.isEditing &&
            (modal.loadingIdpProvider ? (
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
            {modal.isEditing && modal.loadingIdpProvider ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                paddingTop={4}
              >
                <LoadingDots size="medium" />
              </Box>
            ) : (
              <>
                <Input
                  name="name"
                  label={formatMessage(m.idpProvidersName)}
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
                  label={formatMessage(m.idpProvidersDescription)}
                  value={modal.formData.description}
                  onChange={(e) =>
                    modal.setFormField('description', e.target.value)
                  }
                  size="sm"
                  backgroundColor="blue"
                  hasError={!!modal.formErrors.description}
                  errorMessage={modal.formErrors.description}
                />
                <Input
                  name="helptext"
                  label={formatMessage(m.idpProvidersHelptext)}
                  value={modal.formData.helptext}
                  onChange={(e) =>
                    modal.setFormField('helptext', e.target.value)
                  }
                  size="sm"
                  backgroundColor="blue"
                  hasError={!!modal.formErrors.helptext}
                  errorMessage={modal.formErrors.helptext}
                />
                <Input
                  name="level"
                  label={formatMessage(m.idpProvidersLevel)}
                  value={String(modal.formData.level)}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10)
                    if (!isNaN(val)) {
                      modal.setFormField('level', val)
                    }
                  }}
                  type="number"
                  size="sm"
                  backgroundColor="blue"
                  hasError={!!modal.formErrors.level}
                  errorMessage={modal.formErrors.level}
                />
              </>
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
                  disabled={modal.loadingIdpProvider || modal.isPublishing}
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
