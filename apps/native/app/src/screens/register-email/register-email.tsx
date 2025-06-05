import { useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useWindowDimensions } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import styled from 'styled-components/native'

import illustrationSrc from '../../assets/illustrations/digital-services-m1-dots.png'
import logo from '../../assets/logo/logo-64w.png'
import { getConfig } from '../../config'
import { useGetProfileQuery } from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useNavigation } from '../../hooks/use-navigation'
import { useBrowser } from '../../lib/use-browser'
import { Button, NavigationBarSheet, Typography } from '../../ui'
import { Container } from '../../ui/lib/container/container'

const Host = styled.SafeAreaView`
  flex: 1;
`

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

const TextWrapper = styled(Container)`
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

export const RegisterEmailScreen: NavigationFunctionComponent<{
  url?: string
  parentComponentId?: string
}> = ({ componentId }) => {
  useNavigationOptions(componentId)

  const intl = useIntl()
  const { height } = useWindowDimensions()
  const { dismissModal } = useNavigation()
  const { openBrowser } = useBrowser()

  const [hasRegisteredEmail, setHasRegisteredEmail] = useState(false)

  const { data, loading } = useGetProfileQuery({
    pollInterval: 10_000,
    skip: hasRegisteredEmail,
  })

  const email = data?.getUserProfile?.email

  useEffect(() => {
    if (email) {
      setHasRegisteredEmail(true)
    }
  }, [email])

  return (
    <>
      <NavigationBarSheet
        componentId={componentId}
        onClosePress={() => dismissModal(componentId)}
        includeContainer
        showLoading={loading}
      />
      <Host>
        <ContentWrapper>
          <Logo source={logo} resizeMode="contain" />
          <TextWrapper>
            <Title variant="heading2" textAlign="center">
              <FormattedMessage
                id={
                  hasRegisteredEmail
                    ? 'registerEmail.titleRegistered'
                    : 'registerEmail.title'
                }
              />
            </Title>
            <Typography textAlign="center">
              <FormattedMessage
                id={
                  hasRegisteredEmail
                    ? 'registerEmail.descriptionRegistered'
                    : 'registerEmail.description'
                }
              />
            </Typography>
          </TextWrapper>
          {height > 650 && (
            <IllustrationImage source={illustrationSrc} resizeMode="contain" />
          )}
        </ContentWrapper>
        <Container rowGap={1}>
          {hasRegisteredEmail ? (
            <Button
              isOutlined
              title={intl.formatMessage({
                id: 'registerEmail.close',
                defaultMessage: 'Loka',
              })}
              onPress={() => {
                dismissModal(componentId)
              }}
            />
          ) : (
            <>
              <Button
                onPress={() => {
                  openBrowser(
                    `${getConfig().islandUrl}/minarsidur/min-gogn/stillingar`,
                    componentId,
                  )
                }}
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
            </>
          )}
        </Container>
      </Host>
    </>
  )
}

RegisterEmailScreen.options = getNavigationOptions
