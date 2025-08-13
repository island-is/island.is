import React from 'react'
import { Image, TouchableOpacityProps } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import arrow from '../../assets/icons/arrow.png'
import { dynamicColor } from '../../utils'
import { Typography } from '../typography/typography'

interface CancelProps extends TouchableOpacityProps {
  title: React.ReactNode
  isSmall?: boolean
  arrowBack?: boolean
}

const Host = styled.TouchableOpacity`
  border-bottom-width: 1px;
  border-bottom-color: ${dynamicColor(
    ({ theme }) => theme.color.blue400,
    true,
  )};
`

const Wrapper = styled.View`
  flex-direction: row;
  align-content: center;
  align-items: center;
`

const Title = styled(Typography)<{ arrowBack?: boolean }>`
  margin-right: ${({ theme, arrowBack }) =>
    arrowBack ? 0 : theme.spacing[1]}px;
  margin-left: ${({ theme, arrowBack }) =>
    arrowBack ? theme.spacing[1] : 0}px;
  padding: ${({ theme }) => theme.spacing.smallGutter}px 1px;
`

export function CancelButton({
  title,
  isSmall,
  arrowBack,
  ...rest
}: CancelProps) {
  const theme = useTheme()
  return (
    <Host {...(rest as any)}>
      <Wrapper>
        {arrowBack && (
          <Image
            source={arrow}
            style={{
              width: 10,
              height: 10,
              transform: [{ rotate: '-180deg' }],
            }}
          />
        )}
        <Title
          variant={isSmall ? 'body3' : 'body'}
          weight={600}
          color={theme.color.blue400}
          arrowBack={arrowBack}
        >
          {title}
        </Title>
        {!arrowBack && (
          <Image source={arrow} style={{ width: 10, height: 10 }} />
        )}
      </Wrapper>
    </Host>
  )
}
