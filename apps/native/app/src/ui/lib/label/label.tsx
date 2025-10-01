import { Image } from 'react-native'
import styled, { DefaultTheme } from 'styled-components/native'

import { dynamicColor } from '../../utils'
import dangerIcon from '../../assets/alert/danger.png'
import infoIcon from '../../assets/alert/info-alert.png'
import warningIcon from '../../assets/alert/warning.png'
import { Typography } from '../typography/typography'

type LabelColor = 'default' | 'primary' | 'danger' | 'warning' | 'urgent'
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
      return { light: theme.color.red200, dark: theme.shades.dark.shade300 }
    case 'warning':
      return { light: theme.color.yellow400, dark: theme.color.yellow400 }
    case 'primary':
      return { light: theme.color.blue200, dark: theme.shades.dark.shade300 }
    default:
      return { light: theme.shade.shade400, dark: theme.shades.dark.shade300 }
  }
}

const getBackgroundColor = ({ theme, color }: HelperProps) => {
  switch (color) {
    case 'urgent':
    case 'danger':
      return { light: theme.color.red100, dark: 'transparent' }
    case 'warning':
      return { light: theme.color.yellow200, dark: 'transparent' }
    default:
      return { light: 'transparent', dark: 'transparent' }
  }
}

const getTextColor = ({ theme, color }: HelperProps) => {
  switch (color) {
    case 'urgent':
      return { light: theme.color.dark400, dark: theme.color.dark100 }
    case 'danger':
      return { light: theme.color.red600, dark: theme.color.red400 }
    case 'primary':
      return { light: theme.color.blue400, dark: theme.shades.dark.shade700 }
    default:
      return { light: theme.shade.foreground, dark: theme.shade.foreground }
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
  border-color: ${dynamicColor(getBorderColor, true)};
  background-color: ${dynamicColor(getBackgroundColor)};
  ${({ fullWidth }) => fullWidth && 'flex: 1'};
`

const LabelText = styled(Typography)<{
  color: LabelColor
}>`
  color: ${dynamicColor(getTextColor, true)};
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
      <LabelText variant={'eyebrow'} color={color}>
        {children}
      </LabelText>
    </LabelHost>
  )
}
