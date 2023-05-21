import { ChangeEvent } from 'react'

import { Input, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { m } from '../../lib/messages'
import { useEnvironmentState } from '../../shared/hooks/useEnvironmentState'
import {
  ClientFormTypes,
  EditApplicationResult,
  schema,
} from '../forms/EditApplication/EditApplication.action'
import { useActionData } from 'react-router-dom'
import { useErrorFormatMessage } from '../../shared/hooks/useFormatErrorMessage'
import ContentCard from '../../shared/components/ContentCard/ContentCard'

interface ClientsUrlProps {
  redirectUris: string[]
  postLogoutRedirectUris: string[]
}
const ClientsUrl = ({
  redirectUris,
  postLogoutRedirectUris,
}: ClientsUrlProps) => {
  const actionData = useActionData() as EditApplicationResult<
    typeof schema.applicationUrls
  >
  const { formatMessage } = useLocale()
  const { formatErrorMessage } = useErrorFormatMessage()
  const [uris, setUris] = useEnvironmentState({
    redirectUris: redirectUris.join('\n'),
    postLogoutRedirectUris: postLogoutRedirectUris.join('\n'),
  })

  // Generic onChange handler, name in input will need to match object name to change
  const onChangeURLS = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setUris((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }))
  }

  return (
    <ContentCard
      title={formatMessage(m.clientUris)}
      intent={ClientFormTypes.applicationUrls}
    >
      <Stack space={3}>
        <Stack space={1}>
          <Input
            name="redirectUris"
            type="text"
            size="sm"
            label={formatMessage(m.callbackUrl)}
            textarea
            rows={4}
            onChange={onChangeURLS}
            backgroundColor="blue"
            value={uris.redirectUris}
            placeholder={formatMessage(m.callBackUrlPlaceholder)}
            errorMessage={formatErrorMessage(
              (actionData?.errors?.redirectUris as unknown) as string,
            )}
          />
          <Text variant="small">{formatMessage(m.callBackUrlDescription)}</Text>
        </Stack>
        <Stack space={1}>
          <Input
            name="postLogoutRedirectUris"
            type="text"
            size="sm"
            label={formatMessage(m.logoutUrl)}
            textarea
            rows={4}
            onChange={onChangeURLS}
            backgroundColor="blue"
            value={uris.postLogoutRedirectUris}
            placeholder={formatMessage(m.logoutUrlPlaceholder)}
            errorMessage={formatErrorMessage(
              (actionData?.errors?.postLogoutRedirectUris as unknown) as string,
            )}
          />
          <Text variant="small">{formatMessage(m.logoutUrlDescription)}</Text>
        </Stack>
      </Stack>
    </ContentCard>
  )
}

export default ClientsUrl
