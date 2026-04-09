import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AuthAdminEnvironment } from '@island.is/api/schema'
import {
  AlertMessage,
  Box,
  Button,
  Checkbox,
  GridColumn,
  GridRow,
  Input,
  InputError,
  Stack,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Modal } from '@island.is/react/components'
import { replaceParams } from '@island.is/react-spa/shared'

import { useErrorFormatMessage } from '../../../hooks/useFormatErrorMessage'
import { m } from '../../../lib/messages'
import { IDSAdminPaths } from '../../../lib/paths'
import { authAdminEnvironments } from '../../../utils/environments'
import { useCreateTenantMutation } from '../Tenants.generated'
import {
  CreateTenantFormValues,
  createTenantSchema,
} from './CreateTenantModal.schema'

type FieldErrors = Partial<Record<keyof CreateTenantFormValues, string>>

type CreateTenantModalProps = {
  onClose: () => void
  onCreated: () => void
}

const initialValues: CreateTenantFormValues = {
  name: '',
  nationalId: '',
  displayName: '',
  description: '',
  organisationLogoKey: '',
  contactEmail: '',
  environments: [AuthAdminEnvironment.Development],
}

const CreateTenantModal = ({ onClose, onCreated }: CreateTenantModalProps) => {
  const { formatMessage } = useLocale()
  const { formatErrorMessage } = useErrorFormatMessage()
  const navigate = useNavigate()

  const [values, setValues] = useState<CreateTenantFormValues>(initialValues)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [globalError, setGlobalError] = useState<string | null>(null)

  const [createTenant, { loading }] = useCreateTenantMutation()

  const onChange =
    (field: Exclude<keyof CreateTenantFormValues, 'environments'>) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }))
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }

  const toggleEnvironment = (env: AuthAdminEnvironment) => {
    setValues((prev) => {
      const next = prev.environments.includes(env)
        ? prev.environments.filter((e) => e !== env)
        : [...prev.environments, env]
      return {
        ...prev,
        environments: next as CreateTenantFormValues['environments'],
      }
    })
    setErrors((prev) => ({ ...prev, environments: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGlobalError(null)

    const result = createTenantSchema.safeParse(values)

    if (!result.success) {
      const nextErrors: FieldErrors = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof CreateTenantFormValues | undefined
        if (field && !nextErrors[field]) {
          nextErrors[field] = issue.message
        }
      }
      setErrors(nextErrors)
      return
    }

    try {
      const response = await createTenant({
        variables: {
          input: {
            name: result.data.name,
            nationalId: result.data.nationalId,
            displayName: result.data.displayName,
            description: result.data.description,
            organisationLogoKey: result.data.organisationLogoKey,
            contactEmail: result.data.contactEmail || undefined,
            environments: result.data.environments,
          },
        },
      })

      const createdIn =
        response.data?.createAuthAdminTenant?.map((t) => t.environment) ?? []
      const partiallyCreated =
        createdIn.length !== result.data.environments.length

      if (createdIn.length === 0) {
        setGlobalError(formatMessage(m.createTenantError))
        toast.error(formatMessage(m.createTenantError))
        return
      }

      if (partiallyCreated) {
        toast.warning(formatMessage(m.partiallyCreatedTenant))
      } else {
        toast.success(formatMessage(m.createTenantSuccess))
      }
      onCreated()
      navigate(
        replaceParams({
          href: IDSAdminPaths.IDSAdminClients,
          params: { tenant: result.data.name },
        }),
      )
    } catch (error) {
      setGlobalError(formatMessage(m.createTenantError))
      toast.error(formatMessage(m.createTenantError))
    }
  }

  return (
    <Modal
      id="create-tenant"
      isVisible
      label={formatMessage(m.createTenant)}
      title={formatMessage(m.createTenant)}
      onClose={onClose}
      closeButtonLabel={formatMessage(m.closeModal)}
    >
      <Box paddingTop={2}>
        <form onSubmit={handleSubmit} noValidate>
          <Stack space={3}>
            <GridRow rowGap={3}>
              <GridColumn span={['12/12', '6/12']}>
                <Input
                  name="name"
                  label={formatMessage(m.tenantName)}
                  placeholder={formatMessage(m.tenantNamePlaceholder)}
                  size="sm"
                  backgroundColor="blue"
                  value={values.name}
                  onChange={onChange('name')}
                  errorMessage={formatErrorMessage(errors.name)}
                  tooltip={formatMessage(m.tenantNameTooltip)}
                />
                <Text variant="small" marginTop={1}>
                  {formatMessage(m.tenantNameHelper)}
                </Text>
              </GridColumn>
              <GridColumn span={['12/12', '6/12']}>
                <Input
                  name="nationalId"
                  label={formatMessage(m.tenantNationalId)}
                  size="sm"
                  backgroundColor="blue"
                  value={values.nationalId}
                  onChange={onChange('nationalId')}
                  errorMessage={formatErrorMessage(errors.nationalId)}
                  tooltip={formatMessage(m.tenantNationalIdTooltip)}
                />
              </GridColumn>
              <GridColumn span="12/12">
                <Input
                  name="displayName"
                  label={formatMessage(m.tenantDisplayName)}
                  size="sm"
                  backgroundColor="blue"
                  value={values.displayName}
                  onChange={onChange('displayName')}
                  errorMessage={formatErrorMessage(errors.displayName)}
                  tooltip={formatMessage(m.tenantDisplayNameTooltip)}
                />
              </GridColumn>
              <GridColumn span="12/12">
                <Input
                  name="description"
                  label={formatMessage(m.tenantDescription)}
                  size="sm"
                  backgroundColor="blue"
                  value={values.description}
                  onChange={onChange('description')}
                  errorMessage={formatErrorMessage(errors.description)}
                  tooltip={formatMessage(m.tenantDescriptionTooltip)}
                  textarea
                  rows={2}
                />
              </GridColumn>
              <GridColumn span={['12/12', '6/12']}>
                <Input
                  name="organisationLogoKey"
                  label={formatMessage(m.tenantOrgLogoKey)}
                  size="sm"
                  backgroundColor="blue"
                  value={values.organisationLogoKey}
                  onChange={onChange('organisationLogoKey')}
                  errorMessage={formatErrorMessage(errors.organisationLogoKey)}
                  tooltip={formatMessage(m.tenantOrgLogoKeyTooltip)}
                />
              </GridColumn>
              <GridColumn span={['12/12', '6/12']}>
                <Input
                  name="contactEmail"
                  label={formatMessage(m.tenantContactEmail)}
                  size="sm"
                  backgroundColor="blue"
                  value={values.contactEmail ?? ''}
                  onChange={onChange('contactEmail')}
                  errorMessage={formatErrorMessage(errors.contactEmail)}
                  tooltip={formatMessage(m.tenantContactEmailTooltip)}
                />
              </GridColumn>

              <GridColumn span="12/12">
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
                        id={`create-tenant-env-${env}`}
                        name="environments"
                        value={env}
                        checked={values.environments.includes(env)}
                        onChange={() => toggleEnvironment(env)}
                        large
                        backgroundColor="blue"
                      />
                    </Box>
                  ))}
                </Box>
                {errors.environments && (
                  <Box marginTop={1}>
                    <InputError
                      id="create-tenant-environments-error"
                      errorMessage={formatErrorMessage(errors.environments)}
                    />
                  </Box>
                )}
              </GridColumn>
            </GridRow>

            {globalError && <AlertMessage type="error" message={globalError} />}

            <Box display="flex" justifyContent="spaceBetween">
              <Button onClick={onClose} variant="ghost" type="button">
                {formatMessage(m.cancel)}
              </Button>
              <Button type="submit" loading={loading}>
                {formatMessage(m.create)}
              </Button>
            </Box>
          </Stack>
        </form>
      </Box>
    </Modal>
  )
}

export default CreateTenantModal
