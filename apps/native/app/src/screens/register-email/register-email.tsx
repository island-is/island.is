import { FormattedMessage, useIntl } from 'react-intl'
import { useWindowDimensions } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import styled from 'styled-components/native'

import illustrationSrc from '../../assets/illustrations/digital-services-m1-dots.png'
import logo from '../../assets/logo/logo-64w.png'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useNavigationModal } from '../../hooks/use-navigation-modal'
import { Button, Container, NavigationBarSheet, Typography } from '../../ui'
import { ComponentRegistry } from '../../utils/component-registry'
import { isAndroid } from '../../utils/devices'

const Wrapper = styled.SafeAreaView(({ theme }) => ({
  flex: 1,
  ...(isAndroid && {
    paddingBottom: theme.spacing.p2,
  }),
}))

const Logo = styled.Image`
  width: 40px;
  height: 40px;
  margin-bottom: ${({ theme }) => theme.spacing[5]}px;
`

const ContentWrapper = styled.View`
  flex: 1;
  align-items: center;
  row-gap: ${({ theme }) => theme.spacing[2]}px;
`

const TextWrapper = styled.View`
  max-width: 270px;
`

const Title = styled(Typography)`
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
`

const IllustrationImage = styled.Image`
  flex: 1;
`

const { getNavigationOptions, useNavigationOptions } =
  createNavigationOptionHooks(() => ({
    topBar: {
      visible: false,
    },
  }))

export const RegisterEmailScreen: NavigationFunctionComponent = ({
  componentId,
}) => {
  useNavigationOptions(componentId)

  const intl = useIntl()
  const { height } = useWindowDimensions()
  const { dismissModal, showModal } = useNavigationModal()

  const onRegisterPress = () => {
    dismissModal(componentId)
    showModal(ComponentRegistry.SettingsScreen)
  }

  return (
    <>
      <NavigationBarSheet
        componentId={componentId}
        onClosePress={() => dismissModal(componentId)}
        style={{ marginHorizontal: 16 }}
      />
      <Wrapper>
        <ContentWrapper>
          <Logo source={logo} resizeMode="contain" />
          <Container>
            <TextWrapper>
              <Title variant="heading2" textAlign="center">
                <FormattedMessage id={'registerEmail.title'} />
              </Title>
            </TextWrapper>
            <Typography textAlign="center">
              <FormattedMessage id={'registerEmail.description'} />
            </Typography>
          </Container>
          {height > 650 && (
            <IllustrationImage source={illustrationSrc} resizeMode="contain" />
          )}
        </ContentWrapper>
        <Container rowGap={1}>
          <Button
            onPress={onRegisterPress}
            title={intl.formatMessage({
              id: 'registerEmail.button',
              defaultMessage: 'Skrá netfang',
            })}
          />
          <Button
            isOutlined
            title={intl.formatMessage({
              id: 'registerEmail.cancel',
              defaultMessage: 'Hætta við',
            })}
            onPress={() => {
              dismissModal(componentId)
            }}
          />
        </Container>
      </Wrapper>
    </>
  )
}

RegisterEmailScreen.options = getNavigationOptions
