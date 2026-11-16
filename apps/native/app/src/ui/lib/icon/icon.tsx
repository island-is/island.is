import {
  ColorValue,
  ImageProps,
  ImageSourcePropType,
  ImageStyle,
} from 'react-native'
import styled from 'styled-components/native'

export const StyledIcon = styled.Image<Pick<IconProps, 'width' | 'height'>>(
  ({ width, height }) => ({
    width,
    height,
  }),
)

type IconProps = {
  source: ImageSourcePropType
  width: number
  height: number
  style?: ImageStyle
  tintColor?: ColorValue
  resizeMode?: ImageProps['resizeMode']
}

export const Icon = ({
  resizeMode = 'center',
  tintColor,
  style,
  ...rest
}: IconProps) => {
  return (
    <StyledIcon
      resizeMode={resizeMode}
      // In style rather than the styled object so dynamic colours work too
      style={[tintColor ? { tintColor } : undefined, style]}
      {...rest}
    />
  )
}
