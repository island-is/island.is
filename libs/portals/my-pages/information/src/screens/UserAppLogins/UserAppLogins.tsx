import { useState } from 'react'

import { Box, Button, Stack, Text, toast } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ActionCard,
  CardLoader,
  formatDate,
  IntroWrapper,
  ISLANDIS_SLUG,
  m,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { Modal } from '@island.is/react/components'

import { mAppLogins } from '../../lib/messages'
import {
  GetAuthAppLoginsQuery,
  useGetAuthAppLoginsQuery,
  useRevokeAuthAppLoginMutation,
} from './UserAppLogins.generated'

type AppLogin = GetAuthAppLoginsQuery['authAppLogins'][number]

const platformName: Record<string, string> = {
  ios: 'iOS',
  android: 'Android',
}

const UserAppLogins = () => {
  useNamespaces(['sp.settings'])
  const { formatMessage } = useLocale()
  const [toRemove, setToRemove] = useState<AppLogin>()

  const { data, loading, error, refetch } = useGetAuthAppLoginsQuery({
    fetchPolicy: 'network-only',
  })
  const [revoke, { loading: revoking }] = useRevokeAuthAppLoginMutation()

  const appLogins = data?.authAppLogins ?? []

  const appName = (appLogin: AppLogin) =>
    appLogin.clientName ?? appLogin.clientId
  const deviceName = (appLogin: AppLogin) =>
    appLogin.deviceName ?? formatMessage(mAppLogins.unknownDevice)
  const loginMethod = (appLogin: AppLogin) =>
    appLogin.loginIdp === 'audkenni_app'
      ? formatMessage(mAppLogins.loginApp)
      : appLogin.loginIdp === 'audkenni_sim'
      ? formatMessage(mAppLogins.loginSim)
      : undefined

  const remove = async () => {
    if (!toRemove) return
    try {
      await revoke({ variables: { id: toRemove.id } })
      toast.success(formatMessage(mAppLogins.removed))
    } catch {
      toast.error(formatMessage(mAppLogins.removeError))
    }
    setToRemove(undefined)
    refetch()
  }

  return (
    <>
      <IntroWrapper
        marginBottom={[4, 8]}
        title={formatMessage(m.mySettingsAppLogins)}
        intro={formatMessage(mAppLogins.intro)}
        serviceProvider={{
          slug: ISLANDIS_SLUG,
          tooltip: formatMessage(m.userProfileTooltip),
        }}
        desktopContentSpan="10/12"
      />
      {loading && <CardLoader />}
      {error && !loading && <Problem noBorder={false} error={error} />}
      {!loading && !error && appLogins.length === 0 && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(mAppLogins.empty)}
          imgSrc="./assets/images/empty.svg"
        />
      )}
      {!loading && !error && appLogins.length > 0 && (
        <Stack space={2}>
          {appLogins.map((appLogin) => (
            <ActionCard
              key={appLogin.id}
              eyebrow={appName(appLogin)}
              heading={[deviceName(appLogin), platformName[appLogin.platform]]
                .filter(Boolean)
                .join(' · ')}
              text={loginMethod(appLogin)}
              subText={formatMessage(mAppLogins.lastUsed, {
                date: formatDate(appLogin.lastUsed),
              })}
              tag={
                appLogin.biometrics
                  ? {
                      label: formatMessage(mAppLogins.biometrics),
                      variant: 'blue',
                      outlined: true,
                    }
                  : undefined
              }
              cta={{
                label: formatMessage(mAppLogins.remove),
                variant: 'text',
                icon: 'trash',
                iconType: 'outline',
                onClick: () => setToRemove(appLogin),
              }}
            />
          ))}
        </Stack>
      )}
      {toRemove && (
        <Modal
          id="remove-app-login"
          label={formatMessage(mAppLogins.removeTitle)}
          isVisible
          onClose={() => setToRemove(undefined)}
          closeButtonLabel={formatMessage(mAppLogins.cancel)}
        >
          <Box paddingY={3} paddingX={[0, 8]}>
            <Text variant="h2">{formatMessage(mAppLogins.removeTitle)}</Text>
            <Text marginTop={3}>
              {formatMessage(mAppLogins.removeText, {
                app: appName(toRemove),
                device: deviceName(toRemove),
              })}
            </Text>
            <Box
              display="flex"
              justifyContent="spaceBetween"
              alignItems="center"
              marginTop={6}
            >
              <Button variant="ghost" onClick={() => setToRemove(undefined)}>
                {formatMessage(mAppLogins.cancel)}
              </Button>
              <Button
                colorScheme="destructive"
                loading={revoking}
                onClick={remove}
              >
                {formatMessage(mAppLogins.remove)}
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
    </>
  )
}

export default UserAppLogins
