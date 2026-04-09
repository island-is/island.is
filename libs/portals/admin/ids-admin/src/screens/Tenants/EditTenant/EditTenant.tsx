import React from 'react'

import {
  AlertMessage,
  GridColumn,
  GridRow,
  Input,
  Stack,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { getTranslatedValue } from '@island.is/portals/core'

import { EnvironmentHeader } from '../../../components/EnvironmentHeader/EnvironmentHeader'
import { FormCard } from '../../../components/FormCard/FormCard'
import { StickyLayout } from '../../../components/StickyLayout/StickyLayout'
import { EnvironmentProvider } from '../../../context/EnvironmentContext'
import { useErrorFormatMessage } from '../../../hooks/useFormatErrorMessage'
import { m } from '../../../lib/messages'
import { checkEnvironmentsSync } from '../../../utils/checkEnvironmentsSync'
import { TenantFormTypes } from './EditTenant.schema'
import { TenantDangerZone } from './TenantDangerZone'
import { useTenant } from './TenantContext'

export const EditTenant = () => {
  const { formatMessage, locale } = useLocale()
  const { formatErrorMessage } = useErrorFormatMessage()
  const { tenant, selectedEnvironment, onEnvironmentChange, actionData } =
    useTenant()

  const displayName = getTranslatedValue(
    selectedEnvironment.displayName,
    locale,
  )

  // Whether the basic-info fields are the same across every environment the
  // tenant currently exists in. When true, the FormCard shows the "synced"
  // badge; when false, the user can pick a source env from the dropdown and
  // sync this section from there.
  const basicInfoInSync = checkEnvironmentsSync(tenant.environments, [
    'nationalId',
    'displayName',
    'description',
    'organisationLogoKey',
    'contactEmail',
  ])

  return (
    <EnvironmentProvider
      selectedEnvironment={selectedEnvironment.environment}
      availableEnvironments={tenant.availableEnvironments}
    >
      <StickyLayout
        header={
          <EnvironmentHeader
            title={displayName || tenant.id || formatMessage(m.editTenant)}
            selectedEnvironment={selectedEnvironment.environment}
            availableEnvironments={tenant.availableEnvironments}
            onChange={onEnvironmentChange}
          />
        }
      >
        <Stack space={3}>
          <FormCard
            title={formatMessage(m.basicInfo)}
            intent={TenantFormTypes.basicInfo}
            inSync={basicInfoInSync}
          >
            <Stack space={3}>
              <GridRow rowGap={3}>
                <GridColumn span={['12/12', '6/12']}>
                  <Input
                    name="name"
                    label={formatMessage(m.tenantName)}
                    size="sm"
                    backgroundColor="blue"
                    defaultValue={selectedEnvironment.name ?? tenant.id ?? ''}
                    readOnly
                    disabled
                    tooltip={formatMessage(m.tenantNameTooltip)}
                  />
                </GridColumn>
                <GridColumn span={['12/12', '6/12']}>
                  <Input
                    key={`nationalId-${selectedEnvironment.environment}`}
                    name="nationalId"
                    label={formatMessage(m.tenantNationalId)}
                    size="sm"
                    backgroundColor="blue"
                    defaultValue={selectedEnvironment.nationalId ?? ''}
                    errorMessage={formatErrorMessage(
                      actionData?.errors?.nationalId,
                    )}
                    tooltip={formatMessage(m.tenantNationalIdTooltip)}
                  />
                </GridColumn>
                <GridColumn span="12/12">
                  <Input
                    key={`displayName-${selectedEnvironment.environment}`}
                    name="displayName"
                    label={formatMessage(m.tenantDisplayName)}
                    size="sm"
                    backgroundColor="blue"
                    defaultValue={displayName ?? ''}
                    errorMessage={formatErrorMessage(
                      actionData?.errors?.displayName,
                    )}
                    tooltip={formatMessage(m.tenantDisplayNameTooltip)}
                  />
                </GridColumn>
                <GridColumn span="12/12">
                  <Input
                    key={`description-${selectedEnvironment.environment}`}
                    name="description"
                    label={formatMessage(m.tenantDescription)}
                    size="sm"
                    backgroundColor="blue"
                    defaultValue={selectedEnvironment.description ?? ''}
                    errorMessage={formatErrorMessage(
                      actionData?.errors?.description,
                    )}
                    tooltip={formatMessage(m.tenantDescriptionTooltip)}
                    textarea
                    rows={2}
                  />
                </GridColumn>
                <GridColumn span={['12/12', '6/12']}>
                  <Input
                    key={`organisationLogoKey-${selectedEnvironment.environment}`}
                    name="organisationLogoKey"
                    label={formatMessage(m.tenantOrgLogoKey)}
                    size="sm"
                    backgroundColor="blue"
                    defaultValue={selectedEnvironment.organisationLogoKey ?? ''}
                    errorMessage={formatErrorMessage(
                      actionData?.errors?.organisationLogoKey,
                    )}
                    tooltip={formatMessage(m.tenantOrgLogoKeyTooltip)}
                  />
                </GridColumn>
                <GridColumn span={['12/12', '6/12']}>
                  <Input
                    key={`contactEmail-${selectedEnvironment.environment}`}
                    name="contactEmail"
                    label={formatMessage(m.tenantContactEmail)}
                    size="sm"
                    backgroundColor="blue"
                    defaultValue={selectedEnvironment.contactEmail ?? ''}
                    errorMessage={formatErrorMessage(
                      actionData?.errors?.contactEmail,
                    )}
                    tooltip={formatMessage(m.tenantContactEmailTooltip)}
                  />
                </GridColumn>
              </GridRow>

              {actionData?.globalError && (
                <AlertMessage
                  type="error"
                  message={formatMessage(m.updateTenantError)}
                />
              )}
            </Stack>
          </FormCard>

          <TenantDangerZone
            tenantId={tenant.id ?? ''}
            displayName={displayName}
          />
        </Stack>
      </StickyLayout>
    </EnvironmentProvider>
  )
}

export default EditTenant
