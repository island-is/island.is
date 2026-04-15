import { Typography } from '../typography/typography'
import React from 'react'
import {
  ImageSourcePropType,
  Pressable,
  ViewProps
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'
import { dynamicColor, font } from '../../utils'

const logo = require('../../../assets/logo/logo-64w.png')
const externalLink = require('../../../assets/icons/external-link.png')

const Host = styled(SafeAreaView)`
  flex: 1;
  background-color: ${dynamicColor('background')};
`

const Content = styled.View`
  flex: 1;
  padding-horizontal: 16px;
  padding-top: 24px;
  padding-bottom: 8px;
  align-items: center;
  gap: 16px;
`

const LogoImage = styled.Image`
  width: 40px;
  height: 40px;
  margin-top: 8px;
  margin-bottom: 50px;
`

const Title = styled.Text`
  ${font({
  fontWeight: '600',
  fontSize: 22,
  lineHeight: 28,
})}
  text-align: center;
  margin-bottom: 12px;
`

const Body = styled.Text`
  ${font({
  fontWeight: '300',
  fontSize: 16,
  lineHeight: 22,
})}
  text-align: center;
  margin-bottom: 12px;
  padding: 0 8px;
`

const LinkRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  border-bottom-width: 1px;
  border-bottom-color: ${dynamicColor(({ theme }) => theme.color.blue400)};
  padding-bottom: 2px;
  gap: ${({ theme }) => theme.spacing.smallGutter};
`

const LinkText = styled.Text`
  ${font({
  fontWeight: '600',
  fontSize: 14,
  color: ({ theme }) => theme.color.blue400,
})}
  margin-right: 6px;
`

const LinkIcon = styled.Image`
  width: 14px;
  height: 14px;
`

const IllustrationWrapper = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  align-self: stretch;
  margin: 16px 0;
`

const IllustrationImage = styled.Image`
    width: 75%;
    height: 75%;
`

const ButtonStack = styled.View`
  align-self: stretch;
`

const PrimarySlot = styled.View`
  margin-bottom: 12px;
`

interface OnboardingProps extends ViewProps {
  illustration: ImageSourcePropType
  title: React.ReactNode
  body: React.ReactNode
  link?: { title: React.ReactNode; onPress: () => void }
  buttonSubmit: React.ReactNode
  buttonCancel?: React.ReactNode
}

export function Onboarding({
  illustration,
  title,
  body,
  link,
  buttonSubmit,
  buttonCancel,
  ...rest
}: OnboardingProps) {
  const theme = useTheme()
  return (
    <Host {...rest}>
      <Content>
        <LogoImage source={logo} resizeMode="contain" />
        <Typography
          weight="600"
          size={26}
          lineHeight={32}
        >{title}</Typography>
        <Typography
          textAlign="center"
          weight="300"
          size={16}
          lineHeight={24}
        >{body}</Typography>
        {link && (
          <Pressable onPress={link.onPress}>
            <LinkRow>
              <Typography
                weight="600"
                size={14}
                color={theme.color.blue400}
              >{link.title}</Typography>
              <LinkIcon source={externalLink} resizeMode="contain" />
            </LinkRow>
          </Pressable>
        )}
        <IllustrationWrapper>
          <IllustrationImage source={illustration} resizeMode="contain" />
        </IllustrationWrapper>
        <ButtonStack>
          <PrimarySlot>{buttonSubmit}</PrimarySlot>
          {buttonCancel}
        </ButtonStack>
      </Content>
    </Host>
  )
}
