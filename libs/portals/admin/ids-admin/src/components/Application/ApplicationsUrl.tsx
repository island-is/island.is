import { Input, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { useEffect, useState } from 'react'
import { m } from '../../lib/messages'
import ContentCard from './ContentCard'
import { AuthApplicationApplicationUrl } from './Application.loader'

interface ApplicationsUrlProps {
  applicationUrls: AuthApplicationApplicationUrl
}
const ApplicationsUrl = ({ applicationUrls }: ApplicationsUrlProps) => {
  const { formatMessage } = useLocale()
  const [appUrls, setAppUrls] = useState(applicationUrls)

  // Generic onChange handler, name in input will need to match object name to change
  const onChangeURLS = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setAppUrls((prev) => ({
      ...prev,
      [event.target.name]: event.target.value.split(', '),
    }))
  }

  useEffect(() => {
    setAppUrls(applicationUrls)
  }, [applicationUrls])

  return (
    <ContentCard
      title={formatMessage(m.applicationsURLS)}
      onSave={(saveOnAllEnvironments) => {
        console.log('saveOnAllEnvironments: ', saveOnAllEnvironments, appUrls)
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
            value={appUrls.callbackUrls.join(', ')}
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
            value={appUrls.logoutUrls.join(', ')}
            placeholder={formatMessage(m.logoutUrlPlaceholder)}
          />
          <Text variant="small">{formatMessage(m.logoutUrlDescription)}</Text>
        </Stack>
        <Stack space={1}>
          <Input
            name="cors"
            type="text"
            size="sm"
            label={formatMessage(m.cors)}
            textarea
            rows={4}
            onChange={onChangeURLS}
            backgroundColor="blue"
            value={appUrls.cors.join(', ')}
            placeholder={formatMessage(m.corsPlaceholder)}
          />
          <Text variant="small">{formatMessage(m.corsDescription)}</Text>
        </Stack>
      </Stack>
    </ContentCard>
  )
}

export default ApplicationsUrl
