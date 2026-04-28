import React, { useState } from 'react'

import { AuthAdminEnvironment } from '@island.is/api/schema'
import {
  Box,
  Button,
  Checkbox,
  Input,
  InputError,
  Stack,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Modal } from '@island.is/react/components'

import { m } from '../../../lib/messages'
import { authAdminEnvironments } from '../../../utils/environments'
import { useCreateApiScopeUserMutation } from '../../AdminControls/ApiScopeUsers/ApiScopeUsers.generated'

const NATIONAL_ID_REGEX = /^\d{10}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface FormData {
  nationalId: string
  name: string
  email: string
}

interface FormErrors {
  nationalId?: string
  name?: string
  email?: string
  environments?: string
}

interface CreateScopeUserModalProps {
  visible: boolean
  onClose: () => void
  onCreated: (nationalId: string) => void
}

export const CreateScopeUserModal = ({
  visible,
  onClose,
  onCreated,
}: CreateScopeUserModalProps) => {
  const { formatMessage } = useLocale()
  const [formData, setFormData] = useState<FormData>({
    nationalId: '',
    name: '',
    email: '',
  })
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [selectedEnvironments, setSelectedEnvironments] = useState<
    AuthAdminEnvironment[]
  >([])

  const [createUser, { loading }] = useCreateApiScopeUserMutation()

  const resetAndClose = () => {
    setFormData({ nationalId: '', name: '', email: '' })
    setFormErrors({})
    setSelectedEnvironments([])
    onClose()
  }

  const validate = (): FormErrors => {
    const errors: FormErrors = {}

    if (!NATIONAL_ID_REGEX.test(formData.nationalId)) {
      errors.nationalId = formatMessage(m.apiScopeUsersErrorNationalId)
    }

    if (formData.name.length < 2) {
      errors.name = formatMessage(m.apiScopeUsersErrorNameMinLength)
    }

    if (!formData.email.trim()) {
      errors.email = formatMessage(m.apiScopeUsersErrorEmailRequired)
    } else if (!EMAIL_REGEX.test(formData.email)) {
      errors.email = formatMessage(m.apiScopeUsersErrorEmailFormat)
    }

    if (selectedEnvironments.length === 0) {
      errors.environments = formatMessage(
        m.apiScopeUsersErrorEnvironmentRequired,
      )
    }

    return errors
  }

  const handleSubmit = async () => {
    const errors = validate()
    setFormErrors(errors)

    if (Object.keys(errors).length > 0) {
      return
    }

    try {
      await createUser({
        variables: {
          input: {
            nationalId: formData.nationalId,
            name: formData.name,
            email: formData.email,
            environments: selectedEnvironments,
          },
        },
      })

      toast.success(formatMessage(m.createScopeUserSuccess))
      const createdNationalId = formData.nationalId
      resetAndClose()
      onCreated(createdNationalId)
    } catch {
      toast.error(formatMessage(m.createScopeUserError))
    }
  }

  const setFormField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleEnvironmentCheckboxChange = (env: AuthAdminEnvironment) => {
    setSelectedEnvironments((prev) =>
      prev.includes(env) ? prev.filter((e) => e !== env) : [...prev, env],
    )
    if (formErrors.environments) {
      setFormErrors((prev) => ({ ...prev, environments: undefined }))
    }
  }

  if (!visible) {
    return null
  }

  return (
    <Modal
      id="create-scope-user-modal"
      isVisible={visible}
      label={formatMessage(m.createScopeUserTitle)}
      onClose={resetAndClose}
      closeButtonLabel={formatMessage(m.closeModal)}
      scrollType="outside"
    >
      <Box paddingX={4}>
        <Box marginBottom={4}>
          <Text variant="h2" as="h2">
            {formatMessage(m.createScopeUserTitle)}
          </Text>
        </Box>

        <Box marginBottom={3}>
          <Stack space={3}>
            <Input
              name="nationalId"
              label={formatMessage(m.apiScopeUsersNationalId)}
              value={formData.nationalId}
              onChange={(e) => setFormField('nationalId', e.target.value)}
              size="sm"
              backgroundColor="blue"
              hasError={!!formErrors.nationalId}
              errorMessage={formErrors.nationalId}
            />
            <Input
              name="name"
              label={formatMessage(m.apiScopeUsersName)}
              value={formData.name}
              onChange={(e) => setFormField('name', e.target.value)}
              size="sm"
              backgroundColor="blue"
              hasError={!!formErrors.name}
              errorMessage={formErrors.name}
            />
            <Input
              name="email"
              label={formatMessage(m.apiScopeUsersEmail)}
              value={formData.email}
              onChange={(e) => setFormField('email', e.target.value)}
              size="sm"
              backgroundColor="blue"
              hasError={!!formErrors.email}
              errorMessage={formErrors.email}
            />

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
                      id={`create-scope-user-env-${env}`}
                      value={env}
                      checked={selectedEnvironments.includes(env)}
                      onChange={() => handleEnvironmentCheckboxChange(env)}
                      large
                    />
                  </Box>
                ))}
              </Box>
              {formErrors.environments && (
                <InputError
                  id="create-scope-user-environments-error"
                  errorMessage={formErrors.environments}
                />
              )}
            </Box>

            <Box
              paddingTop={4}
              display="flex"
              justifyContent="spaceBetween"
              columnGap={2}
            >
              <Button variant="ghost" onClick={resetAndClose}>
                {formatMessage(m.apiScopeUsersCancelButton)}
              </Button>
              <Button onClick={handleSubmit} loading={loading}>
                {formatMessage(m.apiScopeUsersCreateButton)}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Modal>
  )
}
