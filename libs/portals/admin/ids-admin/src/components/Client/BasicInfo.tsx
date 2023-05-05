import React, { RefObject, useReducer, useRef } from 'react'

import {
  AccordionCard,
  Input,
  Stack,
  toast,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { m } from '../../lib/messages'
import ContentCard from '../../shared/components/ContentCard'
import { AuthAdminClientSecret } from './Client.loader'

interface BasicInfoProps {
  clientId: string
  clientSecrets?: AuthAdminClientSecret | null
  issuerUrl: string
}

const BasicInfoContent = ({
  clientId,
  clientSecrets = [],
  issuerUrl,
}: BasicInfoProps) => {
  const { formatMessage } = useLocale()
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

  const handleCopy = (ref: RefObject<HTMLInputElement>) => {
    if (!ref.current) return

    navigator.clipboard.writeText(ref.current.value).then(() => {
      toast.success(formatMessage(m.copySuccess))
    })
  }

  const secret = clientSecrets?.find((secret) => secret.decryptedValue)
  const hasClientSecrets = Boolean(clientSecrets && clientSecrets.length > 0)
  const isLegacySecret = hasClientSecrets && !secret

  return (
    <ContentCard title={formatMessage(m.basicInfo)}>
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
              label: 'copy',
              type: 'outline',
              onClick: () => handleCopy(clientIdRef),
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
              label={formatMessage(m.clientSecret)}
              buttons={[
                {
                  name: 'copy',
                  type: 'outline',
                  onClick: () => handleCopy(clientSecretRef),
                  label: 'Copy value',
                  disabled: isLegacySecret,
                },
                {
                  name: showSecret ? 'eyeOff' : 'eye',
                  type: 'outline',
                  onClick: toggleSecret,
                  label: showSecret ? 'Hide password' : 'Show password',
                  disabled: isLegacySecret,
                },
              ]}
            />
            <Text variant={'small'}>
              {isLegacySecret
                ? formatMessage(m.clientSecretLegacy)
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
              label: 'copy',
              type: 'outline',
              onClick: () => handleCopy(issuerUrlRef),
            },
          ]}
        />
        <AccordionCard
          id="otherEndpoints"
          label={formatMessage(m.otherEndpoints)}
        >
          <Stack space={3}>
            <Input
              readOnly
              type="text"
              size="sm"
              ref={authorizationUrlRef}
              name="authorizationUrl"
              value={issuerUrl + 'connect/authorize'}
              label={formatMessage(m.oAuthAuthorizationUrl)}
              buttons={[
                {
                  name: 'copy',
                  label: 'copy',
                  type: 'outline',
                  onClick: () => handleCopy(authorizationUrlRef),
                },
              ]}
            />
            <Input
              readOnly
              type="text"
              size="sm"
              ref={tokenUrlRef}
              name="tokenUrl"
              value={issuerUrl + 'connect/token'}
              label={formatMessage(m.oAuthTokenUrl)}
              buttons={[
                {
                  name: 'copy',
                  label: 'copy',
                  type: 'outline',
                  onClick: () => handleCopy(tokenUrlRef),
                },
              ]}
            />
            <Input
              readOnly
              type="text"
              size="sm"
              ref={userInfoUrlRef}
              name="userInfoUrl"
              value={issuerUrl + 'connect/userinfo'}
              label={formatMessage(m.oAuthUserInfoUrl)}
              buttons={[
                {
                  name: 'copy',
                  label: 'copy',
                  type: 'outline',
                  onClick: () => handleCopy(userInfoUrlRef),
                },
              ]}
            />
            <Input
              readOnly
              type="text"
              size="sm"
              ref={endSessionUrlRef}
              name="endSessionUrl"
              value={issuerUrl + 'connect/endsession'}
              label={formatMessage(m.endSessionUrl)}
              buttons={[
                {
                  name: 'copy',
                  label: 'copy',
                  type: 'outline',
                  onClick: () => handleCopy(endSessionUrlRef),
                },
              ]}
            />
            <Input
              readOnly
              type="text"
              size="sm"
              ref={openIdConfigurationUrlRef}
              name="openIdConfigurationUrl"
              value={issuerUrl + '.well-known/openid-configuration'}
              label={formatMessage(m.openIdConfiguration)}
              buttons={[
                {
                  name: 'copy',
                  label: 'copy',
                  type: 'outline',
                  onClick: () => handleCopy(openIdConfigurationUrlRef),
                },
              ]}
            />
            <Input
              readOnly
              type="text"
              size="sm"
              name="jsonWebSetKeyUrl"
              ref={jsonWebSetKeyUrlRef}
              value={issuerUrl + '.well-known/openid-configuration/jwks'}
              label={formatMessage(m.jsonWebKeySet)}
              buttons={[
                {
                  name: 'copy',
                  label: 'copy',
                  type: 'outline',
                  onClick: () => handleCopy(jsonWebSetKeyUrlRef),
                },
              ]}
            />
          </Stack>
        </AccordionCard>
      </Stack>
    </ContentCard>
  )
}

export default BasicInfoContent
