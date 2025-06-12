import { ImageProps, ImageSourcePropType, ImageStyle } from 'react-native'
import styled from 'styled-components/native'
import { Colors } from '../../utils'

export const StyledIcon = styled.Image<
  Pick<IconProps, 'width' | 'height' | 'tintColor'>
>(({ width, height, tintColor, theme }) => ({
  width,
  height,
  ...(tintColor && {
    tintColor: theme.color[tintColor],
  }),
}))

type IconProps = {
  source: ImageSourcePropType
  width: number
  height: number
  style?: ImageStyle
  tintColor?: Colors
  resizeMode?: ImageProps['resizeMode']
}

export const Icon = ({ resizeMode = 'center', ...rest }: IconProps) => {
  return <StyledIcon resizeMode={resizeMode} {...rest} />
}
