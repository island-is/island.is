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

interface AdvancedSettingsProps {
  requirePkce: boolean
  allowOfflineAccess: boolean
  requireConsent: boolean
  supportsTokenExchange: boolean
  slidingRefreshTokenLifetime: number
  customClaims: string[]
}
const AdvancedSettings = ({
  requirePkce,
  allowOfflineAccess,
  requireConsent,
  supportsTokenExchange,
  slidingRefreshTokenLifetime,
  customClaims,
}: AdvancedSettingsProps) => {
  const { formatMessage } = useLocale()
  const actionData = useActionData() as EditApplicationResult<
    typeof schema.advancedSettings
  >

  const [pkce, setPkce] = useState(requirePkce)
  const [offlineAccess, setOfflineAccess] = useState(allowOfflineAccess)
  const [consent, setConsent] = useState(requireConsent)
  const [tokenExchange, setTokenExchange] = useState(supportsTokenExchange)
  const [slidingRefreshToken, setSlidingRefreshToken] = useState(
    slidingRefreshTokenLifetime,
  )
  const [custom, setCustom] = useState(customClaims)

  const { formatErrorMessage } = useErrorFormatMessage()

  return (
    <ContentCard
      title={formatMessage(m.advancedSettings)}
      onSave={() => {
        return
      }}
      intent={ClientFormTypes.advancedSettings}
    >
      <Stack space={3}>
        <Checkbox
          label={formatMessage(m.requireConsent)}
          backgroundColor={'blue'}
          large
          name="requireConsent"
          value={`${consent}`}
          subLabel={formatMessage(m.requireConsentDescription)}
          checked={consent}
          onChange={() => setConsent(!consent)}
        />
        <Checkbox
          label={formatMessage(m.allowOfflineAccess)}
          backgroundColor={'blue'}
          large
          name="allowOfflineAccess"
          value={`${offlineAccess}`}
          subLabel={formatMessage(m.allowOfflineAccessDescription)}
          checked={offlineAccess}
          onChange={() => setOfflineAccess(!offlineAccess)}
        />
        <Checkbox
          label={formatMessage(m.requirePkce)}
          backgroundColor={'blue'}
          large
          name="requirePkce"
          value={`${pkce}`}
          subLabel={formatMessage(m.requirePkceDescription)}
          checked={pkce}
          onChange={() => setPkce(!pkce)}
        />
        <Checkbox
          label={formatMessage(m.supportsTokenExchange)}
          backgroundColor={'blue'}
          large
          name="supportsTokenExchange"
          value={`${tokenExchange}`}
          subLabel={formatMessage(m.supportsTokenExchangeDescription)}
          checked={tokenExchange}
          onChange={() => setTokenExchange(!tokenExchange)}
        />
        <Stack space={1}>
          <Input
            size="sm"
            type="number"
            name="slidingRefreshTokenLifetime"
            value={slidingRefreshToken}
            backgroundColor="blue"
            onChange={(e) => {
              setSlidingRefreshToken(parseInt(e.target.value))
            }}
            label={formatMessage(m.accessTokenExpiration)}
            errorMessage={formatErrorMessage(
              (actionData?.errors
                ?.slidingRefreshTokenLifetime as unknown) as string,
            )}
          />
          <Text variant={'small'}>
            {formatMessage(m.accessTokenExpirationDescription)}
          </Text>
        </Stack>
        <Stack space={1}>
          <Input
            name="customClaims"
            type="text"
            size="sm"
            label={formatMessage(m.customClaims)}
            textarea
            rows={4}
            onChange={(e) => {
              setCustom(e.target.value.split(/\r?\n/) || [])
            }}
            backgroundColor="blue"
            value={custom.length > 0 ? custom.join('\n') : ''}
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
