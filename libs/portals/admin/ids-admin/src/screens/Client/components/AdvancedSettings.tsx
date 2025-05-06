import React from 'react'

import { AuthAdminClientEnvironment } from '@island.is/api/schema'
import { Checkbox, Input, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { m } from '../../../lib/messages'
import { useEnvironmentState } from '../../../hooks/useEnvironmentState'
import { useErrorFormatMessage } from '../../../hooks/useFormatErrorMessage'
import { useReadableSeconds } from '../../../hooks/useReadableSeconds'
import { useSuperAdmin } from '../../../hooks/useSuperAdmin'
import { checkEnvironmentsSync } from '../../../utils/checkEnvironmentsSync'
import { useClient } from '../ClientContext'
import { FormCard } from '../../../components/FormCard/FormCard'
import { ClientFormTypes } from '../EditClient.schema'

type AdvancedSettingsProps = Pick<
  AuthAdminClientEnvironment,
  | 'requirePkce'
  | 'allowOfflineAccess'
  | 'requireConsent'
  | 'supportTokenExchange'
  | 'accessTokenLifetime'
  | 'customClaims'
  | 'singleSession'
>

export const AdvancedSettings = ({
  requirePkce,
  allowOfflineAccess,
  requireConsent,
  supportTokenExchange,
  accessTokenLifetime,
  customClaims,
  singleSession,
}: AdvancedSettingsProps) => {
  const { formatMessage } = useLocale()
  const { isSuperAdmin } = useSuperAdmin()
  const { client, actionData } = useClient()

  const customClaimsString = (
    customClaims?.map((claim) => {
      return `${claim.type}=${claim.value}`
    }) ?? []
  ).join('\n')

  const [inputValues, setInputValues] = useEnvironmentState({
    requirePkce,
    allowOfflineAccess,
    requireConsent,
    supportTokenExchange,
    accessTokenLifetime,
    singleSession,
    customClaims: customClaimsString,
  })

  const { formatErrorMessage } = useErrorFormatMessage()
  const readableAccessTokenLifetime = useReadableSeconds(accessTokenLifetime)

  return (
    <FormCard
      title={formatMessage(m.advancedSettings)}
      intent={ClientFormTypes.advancedSettings}
      accordionLabel={formatMessage(m.settings)}
      headerMarginBottom={3}
      inSync={checkEnvironmentsSync(client.environments, [
        'requirePkce',
        'allowOfflineAccess',
        'requireConsent',
        'supportTokenExchange',
        'accessTokenLifetime',
        'customClaims',
      ])}
    >
      <Stack space={3}>
        <Checkbox
          label={formatMessage(m.requireConsent)}
          backgroundColor="blue"
          large
          disabled={!isSuperAdmin}
          name="requireConsent"
          defaultChecked={inputValues.requireConsent}
          checked={inputValues.requireConsent}
          onChange={(e) => {
            setInputValues({
              ...inputValues,
              requireConsent: e.target.checked,
            })
          }}
          value="true"
          subLabel={formatMessage(m.requireConsentDescription)}
        />
        <Checkbox
          label={formatMessage(m.allowOfflineAccess)}
          backgroundColor="blue"
          large
          disabled={!isSuperAdmin}
          name="allowOfflineAccess"
          defaultChecked={inputValues.allowOfflineAccess}
          checked={inputValues.allowOfflineAccess}
          value="true"
          onChange={(e) => {
            setInputValues({
              ...inputValues,
              allowOfflineAccess: e.target.checked,
            })
          }}
          subLabel={formatMessage(m.allowOfflineAccessDescription)}
        />
        <Checkbox
          label={formatMessage(m.requirePkce)}
          backgroundColor="blue"
          large
          disabled={!isSuperAdmin}
          defaultChecked={inputValues.requirePkce}
          checked={inputValues.requirePkce}
          name="requirePkce"
          value="true"
          onChange={(e) => {
            setInputValues({
              ...inputValues,
              requirePkce: e.target.checked,
            })
          }}
          subLabel={formatMessage(m.requirePkceDescription)}
        />
        <Checkbox
          label={formatMessage(m.supportsTokenExchange)}
          backgroundColor="blue"
          large
          disabled={!isSuperAdmin}
          defaultChecked={inputValues.supportTokenExchange}
          checked={inputValues.supportTokenExchange}
          name="supportTokenExchange"
          value="true"
          onChange={(e) => {
            setInputValues({
              ...inputValues,
              supportTokenExchange: e.target.checked,
            })
          }}
          subLabel={formatMessage(m.supportsTokenExchangeDescription)}
        />
        <Checkbox
          label={formatMessage(m.singleSession)}
          backgroundColor="blue"
          large
          disabled={!isSuperAdmin}
          defaultChecked={inputValues.singleSession}
          checked={inputValues.singleSession}
          name="singleSession"
          value="true"
          onChange={(e) => {
            setInputValues({
              ...inputValues,
              singleSession: e.target.checked,
            })
          }}
          subLabel={formatMessage(m.singleSessionDescription)}
        />
        <Stack space={1}>
          <Input
            size="sm"
            type="number"
            disabled={!isSuperAdmin}
            name="accessTokenLifetime"
            value={inputValues.accessTokenLifetime}
            backgroundColor="blue"
            onChange={(e) => {
              setInputValues({
                ...inputValues,
                accessTokenLifetime: parseInt(e.target.value),
              })
            }}
            label={formatMessage(m.accessTokenExpiration)}
            errorMessage={formatErrorMessage(
              actionData?.errors?.accessTokenLifetime as unknown as string,
            )}
          />
          <Text variant={'small'}>
            {formatMessage(m.accessTokenExpirationDescription)}
            <br />
            {readableAccessTokenLifetime}
          </Text>
        </Stack>
        <Stack space={1}>
          <Input
            name="customClaims"
            type="text"
            size="sm"
            disabled={!isSuperAdmin}
            label={formatMessage(m.customClaims)}
            textarea
            rows={4}
            onChange={(e) => {
              setInputValues({
                ...inputValues,
                customClaims: e.target.value,
              })
            }}
            backgroundColor="blue"
            value={inputValues.customClaims}
            placeholder={'claim=value'}
            errorMessage={formatErrorMessage(
              actionData?.errors?.customClaims as unknown as string,
            )}
          />
          <Text variant="small">
            {formatMessage(m.customClaimsDescription)}
          </Text>
        </Stack>
      </Stack>
    </FormCard>
  )
}
