import React, { useEffect } from 'react'
import { useIntl, FormattedMessage } from 'react-intl'
import {
  View,
  Image,
  Linking,
  BackHandler,
  useWindowDimensions,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styled from 'styled-components/native'
import { router, useLocalSearchParams } from 'expo-router'

import { Button, Typography } from '@/ui'
import logo from '@/assets/logo/logo-64w.png'
import illustrationSrc from '@/assets/illustrations/digital-services-m1-dots.png'
import { isIos } from '@/utils/devices'
import {
  clearLockScreenSuppression,
  suppressLockScreen,
} from '@/stores/auth-store'
import { preferencesStore } from '@/stores/preferences-store'

const Text = styled.View<{ isSmallDevice: boolean }>`
  margin-horizontal: ${({ theme }) => theme.spacing[7]}px;
  text-align: center;
  margin-vertical: ${({ theme, isSmallDevice }) =>
    isSmallDevice ? theme.spacing[3] : theme.spacing[5]}px;
`

const Host = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`

const ButtonWrapper = styled.View<{ isSmallDevice: boolean }>`
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
  padding-vertical: ${({ theme, isSmallDevice }) =>
    isSmallDevice ? theme.spacing[2] : theme.spacing[4]}px;
  gap: ${({ theme }) => theme.spacing[1]}px;
`

const Title = styled(Typography)`
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
`

export default function UpdateAppScreen() {
  const { closable: closableParam } = useLocalSearchParams<{
    closable?: string
  }>()
  const closable = closableParam !== 'false'
  const intl = useIntl()
  const { height } = useWindowDimensions()
  const isSmallDevice = height < 800

  // Make sure if closable = false that android back button does not work
  useEffect(() => {
    if (closable) {
      return
    }
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true)
    return () => sub.remove()
  }, [closable])

  // Suppress the lock while the unclosable wall is up — otherwise the lock's
  // router.back could pop this screen and bypass the required update.
  useEffect(() => {
    if (closable) {
      return
    }
    suppressLockScreen()
    return () => clearLockScreenSuppression()
  }, [closable])

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
        <Host>
          <Image
            source={logo}
            resizeMode="contain"
            style={{ width: 45, height: 45 }}
          />
          <Text isSmallDevice={isSmallDevice}>
            <Title variant={'heading2'} textAlign="center">
              <FormattedMessage
                id="updateApp.title"
                defaultMessage="Uppfæra app"
              />
            </Title>
            <Typography textAlign="center">
              <FormattedMessage
                id="updateApp.description"
                defaultMessage={
                  'Þú ert að fara að nota gamla útgáfu af Ísland.is appinu. Vinsamlegast uppfærðu appið til að halda áfram.'
                }
              />
            </Typography>
          </Text>
          {height > 650 && (
            <Image
              source={illustrationSrc}
              style={{ flex: 1, maxWidth: 210, maxHeight: 240 }}
              resizeMode="contain"
            />
          )}
        </Host>
        <ButtonWrapper isSmallDevice={isSmallDevice}>
          <Button
            title={intl.formatMessage({
              id: 'updateApp.button',
              defaultMessage: 'Uppfæra',
            })}
            onPress={() => {
              Linking.openURL(
                isIos
                  ? 'https://apps.apple.com/app/%C3%ADsland-is-stafr%C3%A6nt-%C3%ADsland/id1569828682'
                  : 'https://play.google.com/store/apps/details?id=is.island.app',
              )
            }}
          />
          {closable && (
            <Button
              isOutlined
              title={intl.formatMessage({
                id: 'updateApp.buttonSkip',
                defaultMessage: 'Sleppa',
              })}
              onPress={() => {
                preferencesStore.setState({ skippedSoftUpdate: true })
                router.back()
              }}
            />
          )}
        </ButtonWrapper>
      </SafeAreaView>
    </View>
  )
}
