import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { SafeAreaView } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import logo from '@/assets/logo/logo-64w.png'
import illustration from '@/assets/illustrations/onboarding-privacy.png'
import { Button, dynamicColor, Typography } from '@/ui'

const Host = styled(SafeAreaView)`
  flex: 1;
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
  background-color: ${dynamicColor('background')};
`

const Content = styled.View`
  flex: 1;
  align-items: center;
  padding-top: ${({ theme }) => theme.spacing[4]}px;
`

const Logo = styled.Image`
  width: 40px;
  height: 40px;
  margin-bottom: ${({ theme }) => theme.spacing[5]}px;
`

const Title = styled(Typography)`
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
`

const Paragraph = styled(Typography)`
  padding-horizontal: ${({ theme }) => theme.spacing[1]}px;
  margin-bottom: ${({ theme }) => theme.spacing[1]}px;
`

const IllustrationWrapper = styled.View`
  flex: 1;
  align-self: stretch;
  align-items: center;
  justify-content: center;
  margin-vertical: ${({ theme }) => theme.spacing[2]}px;
`

const Illustration = styled.Image`
  width: 75%;
  height: 75%;
`

const Footer = styled.View`
  padding-bottom: ${({ theme }) => theme.spacing[2]}px;
`

// Weights map to font families, so the bold chunk has to go through
// Typography to pick up the semibold family.
const bold = {
  b: (chunks: React.ReactNode[]) => (
    <Typography weight="600">{chunks}</Typography>
  ),
}

interface ReloginNoticeProps {
  onLoginPress(): void
  loading?: boolean
}

/**
 * Shown once to people who used a PIN before the update: they have to log in
 * again with electronic ID. There is deliberately nothing to dismiss.
 */
export function ReloginNotice({ onLoginPress, loading }: ReloginNoticeProps) {
  const intl = useIntl()

  return (
    <Host>
      <Content>
        <Logo source={logo} resizeMode="contain" />
        <Title variant="heading2" textAlign="center">
          {intl.formatMessage({ id: 'relogin.title' })}
        </Title>
        <Paragraph textAlign="center">
          <FormattedMessage id="relogin.body" values={bold} />
        </Paragraph>
        <Paragraph textAlign="center">
          {intl.formatMessage({ id: 'relogin.description' })}
        </Paragraph>
        <IllustrationWrapper>
          <Illustration source={illustration} resizeMode="contain" />
        </IllustrationWrapper>
      </Content>
      <Footer>
        <Button
          title={intl.formatMessage({ id: 'relogin.loginButton' })}
          onPress={onLoginPress}
          loading={loading}
          disabled={loading}
        />
      </Footer>
    </Host>
  )
}
