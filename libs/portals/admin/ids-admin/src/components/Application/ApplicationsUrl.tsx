import { Input, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { useEffect, useState } from 'react'
import { m } from '../../lib/messages'
import ContentCard from './ContentCard'

const ApplicationsUrl = ({ applicationUrls }: any) => {
  const { formatMessage } = useLocale()
  const [appUrls, setAppUrls] = useState(applicationUrls)
  const [changed, setChanged] = useState(false)

  // Generic onChange handler, name in input will need to match object name to change
  const onChangeURLS = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setAppUrls((prev: any) => ({
      ...prev,
      [event.target.name]: event.target.value.split(', '),
    }))
  }

  useEffect(() => {
    setAppUrls(applicationUrls)
  }, [applicationUrls])

  useEffect(() => {
    setChanged(JSON.stringify(appUrls) !== JSON.stringify(applicationUrls))
  }, [appUrls, applicationUrls])

  return (
    <ContentCard
      title={formatMessage(m.applicationsURLS)}
      onSave={(saveOnAllEnvironments) => {
        console.log('saveOnAllEnvironments: ', saveOnAllEnvironments, appUrls)
      }}
      changed={changed}
    >
      <Stack space={3}>
        <Stack space={1}>
          <Input
            name="callBackUrl"
            type="text"
            size="sm"
            label={formatMessage(m.callbackUrl)}
            textarea
            rows={4}
            onChange={onChangeURLS}
            backgroundColor="blue"
            value={appUrls.callBackUrl.join(', ')}
            placeholder={formatMessage(m.callBackUrlPlaceholder)}
          />
          <Text variant="small">{formatMessage(m.callBackUrlDescription)}</Text>
        </Stack>
        <Stack space={1}>
          <Input
            name="logoutUrl"
            type="text"
            size="sm"
            label={formatMessage(m.logoutUrl)}
            textarea
            rows={4}
            onChange={onChangeURLS}
            backgroundColor="blue"
            value={appUrls.logoutUrl.join(', ')}
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
