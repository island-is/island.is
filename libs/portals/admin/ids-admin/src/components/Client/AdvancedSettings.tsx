import { Checkbox, Input, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import ContentCard from '../../shared/components/ContentCard'
import {
  ClientFormTypes,
  EditApplicationResult,
  schema,
} from '../forms/EditApplication/EditApplication.action'
import React, { useState } from 'react'
import { useErrorFormatMessage } from '../../shared/hooks/useFormatErrorMessage'
import { useActionData } from 'react-router-dom'
import { useAuth } from '@island.is/auth/react'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { useReadableSeconds } from './ReadableSeconds'

interface AdvancedSettingsProps {
  requirePkce: boolean
  allowOfflineAccess: boolean
  requireConsent: boolean
  supportTokenExchange: boolean
  slidingRefreshTokenLifetime: number
  customClaims: string[]
}

const AdvancedSettings = ({
  requirePkce,
  allowOfflineAccess,
  requireConsent,
  supportTokenExchange,
  slidingRefreshTokenLifetime,
  customClaims,
}: AdvancedSettingsProps) => {
  const { formatMessage } = useLocale()
  const actionData = useActionData() as EditApplicationResult<
    typeof schema.advancedSettings
  >
  const { userInfo } = useAuth()

  const isSuperAdmin = userInfo?.scopes.includes(
    AdminPortalScope.idsAdminSuperUser,
  )

  const [inputValues, setInputValues] = useState({
    requirePkce,
    allowOfflineAccess,
    requireConsent,
    supportTokenExchange,
    slidingRefreshTokenLifetime,
    customClaims,
  })

  const { formatErrorMessage } = useErrorFormatMessage()

  const readableSlidingRefreshToken = useReadableSeconds(
    slidingRefreshTokenLifetime,
  )

  return (
    <ContentCard
      title={formatMessage(m.advancedSettings)}
      intent={ClientFormTypes.advancedSettings}
      accordionLabel={formatMessage(m.settings)}
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
        <Stack space={1}>
          <Input
            size="sm"
            type="number"
            disabled={!isSuperAdmin}
            name="slidingRefreshTokenLifetime"
            value={inputValues.slidingRefreshTokenLifetime}
            backgroundColor="blue"
            onChange={(e) => {
              setInputValues({
                ...inputValues,
                slidingRefreshTokenLifetime: parseInt(e.target.value),
              })
            }}
            label={formatMessage(m.accessTokenExpiration)}
            errorMessage={formatErrorMessage(
              (actionData?.errors
                ?.slidingRefreshTokenLifetime as unknown) as string,
            )}
          />
          <Text variant={'small'}>
            {formatMessage(m.accessTokenExpirationDescription)}
            <br />
            {readableSlidingRefreshToken}
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
                customClaims: e.target.value.split(/\r?\n/),
              })
            }}
            backgroundColor="blue"
            value={
              inputValues.customClaims.length > 0
                ? inputValues.customClaims.join('\n')
                : ''
            }
            placeholder={'claim=Value'}
            errorMessage={formatErrorMessage(
              (actionData?.errors?.customClaims as unknown) as string,
            )}
          />
          <Text variant="small">{formatMessage(m.callBackUrlDescription)}</Text>
        </Stack>
      </Stack>
    </ContentCard>
  )
}

export default AdvancedSettings
