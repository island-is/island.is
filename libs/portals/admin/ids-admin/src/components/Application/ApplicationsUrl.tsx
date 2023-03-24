import { Input, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { useEffect, useState } from 'react'
import { m } from '../../lib/messages'
import ContentCard from '../forms/EditApplication/ContentCard'
import { AuthApplicationApplicationUrlList } from './Application.loader'
import {
  ClientFormTypes,
  EditApplicationResult,
  schema,
} from '../forms/EditApplication/EditApplication.action'
import { useActionData } from 'react-router-dom'
import { useErrorFormatMessage } from '../../shared/hooks/useFormatErrorMessage'

interface ApplicationsUrlProps {
  applicationUrls: AuthApplicationApplicationUrlList
}
const ApplicationsUrl = ({ applicationUrls }: ApplicationsUrlProps) => {
  const actionData = useActionData() as EditApplicationResult<
    typeof schema.applicationUrl
  >
  const { formatMessage } = useLocale()
  const { formatErrorMessage } = useErrorFormatMessage()
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
      intent={ClientFormTypes.applicationUrls}
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
            errorMessage={formatErrorMessage(
              (actionData?.errors?.callbackUrls as unknown) as string,
            )}
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
            errorMessage={formatErrorMessage(
              (actionData?.errors?.logoutUrls as unknown) as string,
            )}
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
            errorMessage={formatErrorMessage(
              (actionData?.errors?.cors as unknown) as string,
            )}
          />
          <Text variant="small">{formatMessage(m.corsDescription)}</Text>
        </Stack>
      </Stack>
    </ContentCard>
  )
}

export default ApplicationsUrl
