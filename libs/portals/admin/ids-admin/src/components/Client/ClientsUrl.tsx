import { ChangeEvent, useEffect, useState } from 'react'

import { Input, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { m } from '../../lib/messages'
import ContentCard from './ContentCard'
import { AuthClient } from './Client.loader'

interface ClientsUrlProps {
  redirectUris: string[]
  postLogoutRedirectUris: string[]
}
const ClientsUrl = ({
  redirectUris,
  postLogoutRedirectUris,
}: ClientsUrlProps) => {
  const { formatMessage } = useLocale()
  const [uris, setUris] = useState({
    redirectUris,
    postLogoutRedirectUris,
  })

  // Generic onChange handler, name in input will need to match object name to change
  const onChangeURLS = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setUris((prev) => ({
      ...prev,
      [event.target.name]: event.target.value.split(', '),
    }))
  }

  useEffect(() => {
    setUris({ redirectUris, postLogoutRedirectUris })
  }, [redirectUris, postLogoutRedirectUris])

  return (
    <ContentCard
      title={formatMessage(m.clientUris)}
      onSave={(saveOnAllEnvironments) => {
        console.log('saveOnAllEnvironments: ', saveOnAllEnvironments, uris)
      }}
    >
      <Stack space={3}>
        <Stack space={1}>
          <Input
            name="callbackUrls"
            type="text"
            size="sm"
            label={formatMessage(m.callbackUrl)}
            textarea
            rows={4}
            onChange={onChangeURLS}
            backgroundColor="blue"
            value={redirectUris.join(', ')}
            placeholder={formatMessage(m.callBackUrlPlaceholder)}
          />
          <Text variant="small">{formatMessage(m.callBackUrlDescription)}</Text>
        </Stack>
        <Stack space={1}>
          <Input
            name="logoutUrls"
            type="text"
            size="sm"
            label={formatMessage(m.logoutUrl)}
            textarea
            rows={4}
            onChange={onChangeURLS}
            backgroundColor="blue"
            value={postLogoutRedirectUris.join(', ')}
            placeholder={formatMessage(m.logoutUrlPlaceholder)}
          />
          <Text variant="small">{formatMessage(m.logoutUrlDescription)}</Text>
        </Stack>
      </Stack>
    </ContentCard>
  )
}

export default ClientsUrl
