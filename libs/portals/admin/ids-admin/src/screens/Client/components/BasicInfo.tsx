import React, { useReducer, useRef } from 'react'

import { AccordionCard, Input, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { m } from '../../../lib/messages'
import { AuthAdminClientSecret } from '../Client.loader'
import { useCopyToClipboard } from '../../../hooks/useCopyToClipboard'
import { FormCard } from '../../../components/FormCard/FormCard'

interface BasicInfoProps {
  clientId: string
  clientSecrets?: AuthAdminClientSecret | null
  issuerUrl: string
}

export const BasicInfo = ({
  clientId,
  clientSecrets = [],
  issuerUrl,
}: BasicInfoProps) => {
  const { formatMessage } = useLocale()
  const { copyToClipboard } = useCopyToClipboard()
  const [showSecret, toggleSecret] = useReducer((s) => !s, false)
  const clientIdRef = useRef<HTMLInputElement>(null)
  const clientSecretRef = useRef<HTMLInputElement>(null)
  const issuerUrlRef = useRef<HTMLInputElement>(null)
  const authorizationUrlRef = useRef<HTMLInputElement>(null)
  const tokenUrlRef = useRef<HTMLInputElement>(null)
  const userInfoUrlRef = useRef<HTMLInputElement>(null)
  const endSessionUrlRef = useRef<HTMLInputElement>(null)
  const openIdConfigurationUrlRef = useRef<HTMLInputElement>(null)
  const jsonWebSetKeyUrlRef = useRef<HTMLInputElement>(null)

  const secret = clientSecrets?.find((secret) => secret.decryptedValue)
  const hasClientSecrets = Boolean(clientSecrets && clientSecrets.length > 0)
  const isLegacySecret = hasClientSecrets && !secret

  return (
    <FormCard title={formatMessage(m.basicInfo)}>
      <Stack space={3}>
        <Input
          ref={clientIdRef}
          readOnly
          type="text"
          size="sm"
          name="clientId"
          value={clientId}
          label={formatMessage(m.clientId)}
          buttons={[
            {
              name: 'copy',
              label: `${formatMessage(m.copy)} ${formatMessage(m.clientId)}`,
              type: 'outline',
              onClick: () => copyToClipboard(clientIdRef),
            },
          ]}
        />
        {hasClientSecrets && (
          <Stack space={1}>
            <Input
              readOnly
              type={showSecret ? 'text' : 'password'}
              ref={clientSecretRef}
              size="sm"
              name="clientSecret"
              value={secret?.decryptedValue ?? '*'.repeat(16)}
              label={formatMessage(
                isLegacySecret ? m.clientSecretLegacy : m.clientSecret,
              )}
              buttons={[
                {
                  name: showSecret ? 'eyeOff' : 'eye',
                  type: 'outline',
                  onClick: toggleSecret,
                  label: showSecret
                    ? formatMessage(m.hidePassword)
                    : formatMessage(m.showPassword),
                  disabled: isLegacySecret,
                },
                {
                  name: 'copy',
                  type: 'outline',
                  onClick: () => copyToClipboard(clientSecretRef),
                  label: `${formatMessage(m.copy)} ${formatMessage(
                    m.clientSecret,
                  )}`,
                  disabled: isLegacySecret,
                },
              ]}
            />
            <Text variant={'small'}>
              {isLegacySecret
                ? formatMessage(m.clientSecretDescriptionLegacy)
                : formatMessage(m.clientSecretDescription)}
            </Text>
          </Stack>
        )}
        <Input
          readOnly
          type="text"
          ref={issuerUrlRef}
          size="sm"
          name="issuerUrl"
          value={issuerUrl}
          label={formatMessage(m.idsUrl)}
          buttons={[
            {
              name: 'copy',
              label: `${formatMessage(m.copy)} ${formatMessage(m.idsUrl)}`,
              type: 'outline',
              onClick: () => copyToClipboard(issuerUrlRef),
            },
          ]}
        />
        <AccordionCard
          id="otherEndpoints"
          label={formatMessage(m.otherEndpoints)}
        >
          <Stack space={3}>
            <Text variant="medium">
              {formatMessage(m.otherEndpointsDescription)}
            </Text>
            <Input
              readOnly
              type="text"
              size="sm"
              ref={openIdConfigurationUrlRef}
              name="openIdConfigurationUrl"
              value={issuerUrl + '/.well-known/openid-configuration'}
              label={formatMessage(m.openIdConfiguration)}
              buttons={[
                {
                  name: 'copy',
                  label: formatMessage(m.copy),
                  type: 'outline',
                  onClick: () => copyToClipboard(openIdConfigurationUrlRef),
                },
              ]}
            />
            <Input
              readOnly
              type="text"
              size="sm"
              ref={authorizationUrlRef}
              name="authorizationUrl"
              value={issuerUrl + '/connect/authorize'}
              label={formatMessage(m.oAuthAuthorizationUrl)}
              buttons={[
                {
                  name: 'copy',
                  label: formatMessage(m.copy),
                  type: 'outline',
                  onClick: () => copyToClipboard(authorizationUrlRef),
                },
              ]}
            />
            <Input
              readOnly
              type="text"
              size="sm"
              ref={tokenUrlRef}
              name="tokenUrl"
              value={issuerUrl + '/connect/token'}
              label={formatMessage(m.oAuthTokenUrl)}
              buttons={[
                {
                  name: 'copy',
                  label: formatMessage(m.copy),
                  type: 'outline',
                  onClick: () => copyToClipboard(tokenUrlRef),
                },
              ]}
            />
            <Input
              readOnly
              type="text"
              size="sm"
              ref={userInfoUrlRef}
              name="userInfoUrl"
              value={issuerUrl + '/connect/userinfo'}
              label={formatMessage(m.oAuthUserInfoUrl)}
              buttons={[
                {
                  name: 'copy',
                  label: formatMessage(m.copy),
                  type: 'outline',
                  onClick: () => copyToClipboard(userInfoUrlRef),
                },
              ]}
            />
            <Input
              readOnly
              type="text"
              size="sm"
              ref={endSessionUrlRef}
              name="endSessionUrl"
              value={issuerUrl + '/connect/endsession'}
              label={formatMessage(m.endSessionUrl)}
              buttons={[
                {
                  name: 'copy',
                  label: formatMessage(m.copy),
                  type: 'outline',
                  onClick: () => copyToClipboard(endSessionUrlRef),
                },
              ]}
            />
            <Input
              readOnly
              type="text"
              size="sm"
              name="jsonWebSetKeyUrl"
              ref={jsonWebSetKeyUrlRef}
              value={issuerUrl + '/.well-known/openid-configuration/jwks'}
              label={formatMessage(m.jsonWebKeySet)}
              buttons={[
                {
                  name: 'copy',
                  label: formatMessage(m.copy),
                  type: 'outline',
                  onClick: () => copyToClipboard(jsonWebSetKeyUrlRef),
                },
              ]}
            />
          </Stack>
        </AccordionCard>
      </Stack>
    </FormCard>
  )
}
