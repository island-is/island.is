import React from 'react'
import { useIntl } from 'react-intl'
import Svg, { Path } from 'react-native-svg'
import styled, { useTheme } from 'styled-components/native'

import logo from '@/assets/logo/logo-64w.png'
import { token } from '@/ui'

const Host = styled.View`
  height: 40px;
  margin-top: ${({ theme }) => theme.spacing[2]}px;
  align-items: center;
  justify-content: center;
`

const Logo = styled.Image`
  width: 40px;
  height: 40px;
`

const Side = styled.View<{ side: 'left' | 'right' }>`
  position: absolute;
  ${({ side }) => side}: 0;
`

// Round, raised buttons like the system's own header buttons.
export const HeaderButton = styled.TouchableOpacity`
  min-width: 40px;
  height: 40px;
  padding-horizontal: ${({ theme }) => theme.spacing[1]}px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  background-color: ${token((t) => t.background.invert)};
  shadow-color: #000;
  shadow-opacity: 0.12;
  shadow-radius: 8px;
  shadow-offset: 0px 2px;
  elevation: 3;
`

// A header button with a word in it, e.g. the language button.
export const HeaderTextButton = styled(HeaderButton)`
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
`

interface LoginHeaderProps {
  onBackPress?(): void
  /** Rendered on the right, e.g. the language button */
  right?: React.ReactNode
}

export function LoginHeader({ onBackPress, right }: LoginHeaderProps) {
  const intl = useIntl()
  const theme = useTheme()

  return (
    <Host>
      {onBackPress && (
        <Side side="left">
          <HeaderButton
            onPress={onBackPress}
            accessibilityRole="button"
            accessibilityLabel={intl.formatMessage({ id: 'login.back' })}
          >
            {/* Ionicons chevron-back */}
            <Svg width={22} height={22} viewBox="0 0 512 512">
              <Path
                d="M328 112L184 256l144 144"
                fill="none"
                stroke={theme.tokens.interactive.foreground.primary}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={48}
              />
            </Svg>
          </HeaderButton>
        </Side>
      )}
      <Logo source={logo} resizeMode="contain" />
      {right && <Side side="right">{right}</Side>}
    </Host>
  )
}
