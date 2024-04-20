import { Button, Typography, NavigationBarSheet } from '@ui'
import React, { useEffect } from 'react'
import { useIntl, FormattedMessage } from 'react-intl'
import { View, Image, SafeAreaView, Alert } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import logo from '../../assets/logo/logo-64w.png'
import illustrationSrc from '../../assets/illustrations/digital-services-m1.png'
import { openBrowser, openNativeBrowser } from '../../lib/rn-island'
import { preferencesStore } from '../../stores/preferences-store'
import { registerPasskey } from '../../lib/passkeys/registerPasskey'
import { authenticatePasskey } from '../../lib/passkeys/authenticatePasskey'

const Text = styled.View`
  margin-horizontal: ${({ theme }) => theme.spacing[7]}px;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[5]}px;
  margin-top: ${({ theme }) => theme.spacing[5]}px;
`

const { getNavigationOptions, useNavigationOptions } =
  createNavigationOptionHooks(() => ({
    topBar: {
      visible: false,
    },
  }))

export const PasskeyScreen: NavigationFunctionComponent<{
  url?: string
}> = ({ componentId, url }) => {
  useNavigationOptions(componentId)
  const intl = useIntl()
  const theme = useTheme()

  useEffect(() => {
    preferencesStore.setState({
      hasOnboardedPasskeys: true,
    })
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <NavigationBarSheet
        componentId={componentId}
        title={''}
        onClosePress={() => Navigation.dismissModal(componentId)}
        style={{ marginHorizontal: 16 }}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <Image
            source={logo}
            resizeMode="contain"
            style={{ width: 45, height: 45 }}
          />
          <Text>
            <Typography
              variant={'heading2'}
              style={{
                paddingHorizontal: theme.spacing[2],
                marginBottom: theme.spacing[2],
              }}
              textAlign="center"
            >
              <FormattedMessage
                id="passkeys.headingTitle"
                defaultMessage="Innskrá með Ísland.is appinu"
              />
            </Typography>
            <Typography textAlign="center">
              <FormattedMessage
                id={
                  url
                    ? 'passkeys.openUrlHeadingSubtitle'
                    : 'passkeys.headingSubtitle'
                }
                defaultMessage={
                  url
                    ? 'Þú ert að fara að opna Ísland.is í vafra. Viltu búa til aðgangslykil til að skrá þig inn sjálfkrafa með appinu?'
                    : 'Viltu búa til aðgangslykil til að skrá þig inn sjálfkrafa með appinu?'
                }
              />
            </Typography>
          </Text>
          <Image
            source={illustrationSrc}
            style={{ width: 195, height: 223 }}
            resizeMode="contain"
          />
        </View>
        <View
          style={{
            paddingHorizontal: theme.spacing[2],
            paddingVertical: theme.spacing[4],
          }}
        >
          <Button
            title={intl.formatMessage({
              id: 'passkeys.createButton',
              defaultMessage: 'Búa til aðgangslykil',
            })}
            onPress={async () => {
              Navigation.dismissModal(componentId)
              try {
                const registered = await registerPasskey()
                if (registered && url) {
                  const authenticated = await authenticatePasskey()
                  if (authenticated) {
                    // TODO: Add login hint
                    openNativeBrowser(url)
                  }
                }
              } catch (error) {
                console.log('catched an error', error)
                Alert.alert(
                  intl.formatMessage({
                    id: 'passkeys.errorTitle',
                    defaultMessage: 'Sleppa',
                  }),
                  intl.formatMessage({
                    id: 'passkeys.errorRegister',
                    defaultMessage: 'Gat ekki búið til aðgangslykil',
                  }),
                )
              }
            }}
            style={{ marginBottom: theme.spacing[1] }}
          />
          <Button
            isOutlined
            title={intl.formatMessage({
              id: 'passkeys.skipButton',
              defaultMessage: 'Sleppa',
            })}
            onPress={() => {
              Navigation.dismissModal(componentId)
              url && openBrowser(url)
            }}
          />
        </View>
      </SafeAreaView>
    </View>
  )
}

PasskeyScreen.options = getNavigationOptions
