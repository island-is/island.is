import { ImageProps, ImageSourcePropType, ImageStyle } from 'react-native'
import styled, { css } from 'styled-components/native'
import { Colors } from '../../utils'

export const StyledIcon = styled.Image<
  Pick<IconProps, 'width' | 'height' | 'tintColor'>
>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  ${({ tintColor, theme }) =>
    tintColor &&
    css`
      tint-color: ${theme.color[tintColor]};
    `}
`

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
