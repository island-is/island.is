import { AccordionCard, Input, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React from 'react'
import { m } from '../../lib/messages'
import ContentCard from '../../shared/components/ContentCard'

interface BasicInfoProps {
  clientId: string
  clientSecret?: string
  issuerUrl: string
}

const BasicInfoContent = ({
  clientId,
  clientSecret,
  issuerUrl,
}: BasicInfoProps) => {
  const { formatMessage } = useLocale()

  return (
    <ContentCard title={formatMessage(m.basicInfo)}>
      <Stack space={3}>
        <Input
          readOnly
          type="text"
          size="sm"
          name="application"
          value={clientId}
          label={formatMessage(m.clientId)}
        />
        <Stack space={1}>
          <Input
            readOnly
            type="password"
            size="sm"
            name="clientSecret"
            value={clientSecret}
            label={formatMessage(m.clientSecret)}
          />
          <Text variant={'small'}>
            {formatMessage(m.clientSecretDescription)}
          </Text>
        </Stack>
        <Input
          readOnly
          type="text"
          size="sm"
          name="application"
          value={issuerUrl}
          label={formatMessage(m.idsUrl)}
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
              name="application"
              value={issuerUrl + 'connect/authorize'}
              label={formatMessage(m.oAuthAuthorizationUrl)}
            />
            <Input
              readOnly
              type="text"
              size="sm"
              name="application"
              value={issuerUrl + 'connect/token'}
              label={formatMessage(m.oAuthTokenUrl)}
            />
            <Input
              readOnly
              type="text"
              size="sm"
              name="application"
              value={issuerUrl + 'connect/userinfo'}
              label={formatMessage(m.oAuthUserInfoUrl)}
            />
            <Input
              readOnly
              type="text"
              size="sm"
              name="application"
              value={issuerUrl + 'connect/endsession'}
              label={formatMessage(m.endSessionUrl)}
            />
            <Input
              readOnly
              type="text"
              size="sm"
              name="application"
              value={issuerUrl + '.well-known/openid-configuration'}
              label={formatMessage(m.openIdConfiguration)}
            />
            <Input
              readOnly
              type="text"
              size="sm"
              name="application"
              value={issuerUrl + '.well-known/openid-configuration/jwks'}
              label={formatMessage(m.jsonWebKeySet)}
            />
          </Stack>
        </AccordionCard>
      </Stack>
    </ContentCard>
  )
}

export default BasicInfoContent
