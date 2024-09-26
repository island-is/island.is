import { Button, Typography, NavigationBarSheet } from '@ui'
import React from 'react'
import { useIntl, FormattedMessage } from 'react-intl'
import { View, Image, SafeAreaView, Linking } from 'react-native'
import styled from 'styled-components/native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import logo from '../../assets/logo/logo-64w.png'
import illustrationSrc from '../../assets/illustrations/digital-services-m1-dots.png'
import { isIos } from '../../utils/devices'

const Text = styled.View`
  margin-horizontal: ${({ theme }) => theme.spacing[7]}px;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[5]}px;
  margin-top: ${({ theme }) => theme.spacing[5]}px;
`

const Host = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`

const ButtonWrapper = styled.View`
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
  padding-vertical: ${({ theme }) => theme.spacing[4]}px;
`

const Title = styled(Typography)`
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
`

const { getNavigationOptions, useNavigationOptions } =
  createNavigationOptionHooks(() => ({
    topBar: {
      visible: false,
    },
    hardwareBackButton: {
      dismissModalOnPress: false,
    },
  }))

export const UpdateAppScreen: NavigationFunctionComponent = ({
  componentId,
}) => {
  useNavigationOptions(componentId)
  const intl = useIntl()

  return (
    <View style={{ flex: 1 }}>
      <NavigationBarSheet
        componentId={componentId}
        title={''}
        onClosePress={() => {
          //noop
        }}
        style={{ marginHorizontal: 16 }}
        closable={false}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <Host>
          <Image
            source={logo}
            resizeMode="contain"
            style={{ width: 45, height: 45 }}
          />
          <Text>
            <Title variant={'heading2'} textAlign="center">
              <FormattedMessage
                id="updateApp.title"
                defaultMessage="Uppfæra app"
              />
            </Title>
            <Typography textAlign="center">
              <FormattedMessage
                id={'updateApp.description'}
                defaultMessage={
                  'Þú ert að fara að nota gamla útgáfu af Ísland.is appinu. Vinsamlegast uppfærðu appið til að halda áfram.'
                }
              />
            </Typography>
          </Text>
          <Image
            source={illustrationSrc}
            style={{ width: 210, height: 240 }}
            resizeMode="contain"
          />
        </Host>
        <ButtonWrapper>
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
        </ButtonWrapper>
      </SafeAreaView>
    </View>
  )
}

UpdateAppScreen.options = getNavigationOptions
