import { ChangeEvent } from 'react'

import { Input, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { m } from '../../../lib/messages'
import { useEnvironmentState } from '../../../hooks/useEnvironmentState'
import { ClientFormTypes } from '../EditClient.schema'
import { useErrorFormatMessage } from '../../../hooks/useFormatErrorMessage'
import { useClient } from '../ClientContext'
import { FormCard } from '../../../components/FormCard/FormCard'

interface ClientsUrlProps {
  redirectUris: string[]
  postLogoutRedirectUris: string[]
}
const ClientsUrl = ({
  redirectUris,
  postLogoutRedirectUris,
}: ClientsUrlProps) => {
  const { formatMessage } = useLocale()
  const { formatErrorMessage } = useErrorFormatMessage()
  const { actionData } = useClient()
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
    <FormCard
      title={formatMessage(m.clientUris)}
      intent={ClientFormTypes.applicationUrls}
      shouldSupportMultiEnvironment={false}
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
              actionData?.errors?.redirectUris as unknown as string,
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
              actionData?.errors?.postLogoutRedirectUris as unknown as string,
            )}
          />
          <Text variant="small">{formatMessage(m.logoutUrlDescription)}</Text>
        </Stack>
      </Stack>
    </FormCard>
  )
}

export default ClientsUrl
