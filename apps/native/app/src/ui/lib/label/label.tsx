import { Image } from 'react-native'
import styled, { DefaultTheme } from 'styled-components/native'

import dangerIcon from '../../assets/alert/danger.png'
import infoIcon from '../../assets/alert/info-alert.png'
import warningIcon from '../../assets/alert/warning.png'
import { Typography } from '../typography/typography'

type LabelColor =
  | 'default'
  | 'primary'
  | 'danger'
  | 'warning'
  | 'urgent'
  | 'pending'
type HelperProps = {
  theme: DefaultTheme
  color: LabelColor
}

interface LabelProps {
  color?: LabelColor
  icon?: React.ReactNode | boolean
  children?: React.ReactNode
  fullWidth?: boolean
}

const getBorderColor = ({ theme, color }: HelperProps) => {
  switch (color) {
    case 'urgent':
    case 'danger':
      return theme.tokens.feedback.error.border
    case 'warning':
      return theme.tokens.feedback.warning.border
    case 'primary':
      return theme.tokens.feedback.information.border
    case 'pending':
      return theme.tokens.feedback.tags.purple.border
    default:
      return theme.tokens.app.border.muted
  }
}

const getBackgroundColor = ({ theme, color }: HelperProps) => {
  switch (color) {
    case 'urgent':
    case 'danger':
      return theme.tokens.feedback.error.background
    case 'warning':
      return theme.tokens.feedback.warning.background
    default:
      return 'transparent'
  }
}

const getTextColor = ({ theme, color }: HelperProps) => {
  switch (color) {
    case 'urgent':
      return theme.tokens.foreground.primary
    case 'danger':
      return theme.tokens.feedback.error.foregroundContrast
    case 'primary':
      return theme.tokens.feedback.information.foreground
    case 'pending':
      return theme.tokens.feedback.tags.purple.accent
    default:
      return theme.tokens.foreground.primary
  }
}

const getIconByColor = (color: LabelColor) => {
  switch (color) {
    case 'primary':
      return infoIcon
    case 'warning':
      return warningIcon
    case 'urgent':
    case 'danger':
      return dangerIcon
    default:
      return null
  }
}
const LabelHost = styled.View<{ color: LabelColor; fullWidth?: boolean }>`
  align-items: center;
  justify-content: ${({ fullWidth }) => (fullWidth ? 'flex-start' : 'center')};
  padding: ${({ theme }) => theme.spacing[1]}px;
  padding-top: 6px;
  padding-bottom: 6px;
  gap: 6px;
  flex-direction: row;
  border-width: ${({ theme }) => theme.border.width.standard}px;
  border-style: solid;
  border-radius: ${({ theme }) => theme.border.radius.large};
  border-color: ${getBorderColor};
  background-color: ${getBackgroundColor};
  ${({ fullWidth }) => fullWidth && 'flex: 1'};
`

const LabelText = styled(Typography)<{
  color: LabelColor
  fullWidth?: boolean
}>`
  color: ${getTextColor};
  ${({ fullWidth }) => fullWidth && 'flex: 1'};
`

export function Label({
  color = 'default',
  children,
  icon,
  fullWidth = false,
}: LabelProps) {
  const iconElement =
    typeof icon === 'boolean' && icon === true ? (
      <Image
        source={getIconByColor(color)}
        style={{ width: 16, height: 16 }}
        resizeMode="contain"
      />
    ) : (
      icon
    )

  return (
    <LabelHost color={color} fullWidth={fullWidth}>
      {iconElement}
      <LabelText variant={'eyebrow'} color={color} fullWidth={fullWidth}>
        {children}
      </LabelText>
    </LabelHost>
  )
}
