import React from 'react'
import { ImageSourcePropType } from 'react-native'
import styled from 'styled-components/native'
import { dynamicColor } from '../../utils/dynamic-color'
import { Skeleton } from '../skeleton/skeleton'
import { Typography } from '../typography/typography'

const Host = styled.View<{ hasBorder?: boolean }>`
  padding-bottom: ${({ theme }) => theme.spacing[2]}px;
  border-bottom-width: ${({ hasBorder }) => (hasBorder ? '1px' : 0)};
  border-bottom-color: ${dynamicColor(
    (props) => ({
      dark: props.theme.shades.dark.shade200,
      light: props.theme.color.blue100,
    }),
    true,
  )};
  margin-bottom: ${({ hasBorder }) => (hasBorder ? '16px' : 0)};
  margin-top: ${({ theme }) => theme.spacing[2]}px;
`

const Logo = styled.Image`
  width: 16px;
  height: 16px;
`

const LogoBackground = styled.View`
  background-color: ${dynamicColor(
    (props) => ({
      dark: props.theme.color.white,
      light: props.theme.color.blue100,
    }),
    true,
  )};
  height: 24px;
  width: 24px;
  justify-content: center;
  align-items: center;
  border-radius: ${({ theme }) => theme.border.radius.circle};
  margin-right: ${({ theme }) => theme.spacing[1]}px;
`

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: ${({ theme }) => theme.spacing[1]}px;
`

const Wrapper = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
  padding-right: ${({ theme }) => theme.spacing[1]}px;
`

interface HeaderProps {
  title?: string
  logo?: ImageSourcePropType
  date?: React.ReactNode
  message?: string
  isLoading?: boolean
  hasBorder?: boolean
}

export function Header({
  title,
  logo,
  date,
  message,
  isLoading,
  hasBorder = true,
}: HeaderProps) {
  return (
    <Host hasBorder={hasBorder}>
      <Row>
        {isLoading ? (
          <Skeleton active style={{ borderRadius: 4 }} height={17} />
        ) : (
          <>
            <Wrapper>
              {logo && (
                <LogoBackground>
                  <Logo source={logo} />
                </LogoBackground>
              )}
              {title && (
                <Typography
                  variant="body3"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {title}
                </Typography>
              )}
            </Wrapper>
            {date && <Typography variant="body3">{date}</Typography>}
          </>
        )}
      </Row>
      {message && isLoading ? (
        <Skeleton active style={{ borderRadius: 4 }} height={32} />
      ) : message && !isLoading ? (
        <Typography style={{ paddingBottom: 8, fontWeight: '600' }}>
          {message}
        </Typography>
      ) : null}
    </Host>
  )
}
