import {Theme, dynamicColor, font} from '@ui/utils';
import styled, {DefaultTheme} from 'styled-components/native';
import warningIcon from '../../assets/alert/warning.png';
import infoIcon from '../../assets/alert/info-alert.png';
import dangerIcon from '../../assets/alert/danger.png';
import {Image} from 'react-native';

type LabelColor = 'default' | 'primary' | 'danger' | 'warning';
type HelperProps = {theme: DefaultTheme; color: LabelColor};

interface LabelProps {
  color?: LabelColor;
  icon?: React.ReactNode | boolean;
  children?: React.ReactNode;
}

function getBorderColor({theme, color}: HelperProps) {
  switch (color) {
    case 'danger':
      return {light: theme.color.red200, dark: theme.shades.dark.shade300};
    case 'warning':
      return {light: theme.color.yellow400, dark: theme.color.yellow400};
    case 'primary':
      return {light: theme.color.blue200, dark: theme.shades.dark.shade300};
    default:
      return {light: theme.shade.shade400, dark: theme.shades.dark.shade300};
  }
}

function getBackgroundColor({theme, color}: HelperProps) {
  switch (color) {
    case 'danger':
      return {light: theme.color.red100, dark: 'transparent'};
    case 'warning':
      return {light: theme.color.yellow200, dark: 'transparent'};
    default:
      return {light: 'transparent', dark: 'transparent'};
  }
}

function getTextColor({theme, color}: HelperProps) {
  switch (color) {
    case 'danger':
      return {light: theme.color.red600, dark: theme.color.red400};
    case 'primary':
      return {light: theme.color.blue400, dark: theme.shades.dark.shade700};
    default:
      return {light: theme.shade.foreground, dark: theme.shade.foreground};
  }
}

function getIconByColor(color: LabelColor) {
  switch (color) {
    case 'primary':
      return infoIcon;
    case 'warning':
      return warningIcon;
    case 'danger':
      return dangerIcon;
    default:
      return null;
  }
}

const LabelHost = styled.View<{color: LabelColor}>`
  padding: ${({theme}) => theme.spacing[1]}px;
  padding-top: 6px;
  padding-bottom: 6px;
  gap: 6px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-width: ${({theme}) => theme.border.width.standard}px;
  border-style: solid;
  border-radius: ${({theme}) => theme.border.radius.large};
  border-color: ${dynamicColor(getBorderColor, true)};
  background-color: ${dynamicColor(getBackgroundColor)};
`;

const LabelText = styled.Text<{color: LabelColor}>`
  ${font({
    fontWeight: '600',
    fontSize: 12,
  })}

  color: ${dynamicColor(getTextColor, true)};
`;

export function Label({color = 'default', children, icon}: LabelProps) {
  const iconElement =
    typeof icon === 'boolean' && icon === true ? (
      <Image
        source={getIconByColor(color)}
        style={{width: 16, height: 16}}
        resizeMode="contain"
      />
    ) : (
      icon
    );

  return (
    <LabelHost color={color}>
      {iconElement}
      <LabelText color={color}>{children}</LabelText>
    </LabelHost>
  );
}
