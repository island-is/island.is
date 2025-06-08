import { ImageProps, ImageSourcePropType, ImageStyle } from 'react-native'
import styled from 'styled-components/native'

export const StyledIcon = styled.Image<Pick<IconProps, 'width' | 'height'>>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
`

type IconProps = {
  source: ImageSourcePropType
  width: number
  height: number
  style?: ImageStyle
  resizeMode?: ImageProps['resizeMode']
}

export const Icon = ({ resizeMode = 'center', ...rest }: IconProps) => {
  return <StyledIcon resizeMode={resizeMode} {...rest} />
}
