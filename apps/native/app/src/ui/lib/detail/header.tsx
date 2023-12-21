import React from 'react'
import { ImageSourcePropType } from 'react-native'
import styled from 'styled-components/native'
import { dynamicColor } from '../../utils/dynamic-color'
import { font } from '../../utils/font'
import { Skeleton } from '../skeleton/skeleton'

const Host = styled.View<{ hasBorder?: boolean }>`
  padding-bottom: 16px;
  border-bottom-width: ${({ hasBorder }) => (hasBorder ? '1px' : 0)};
  border-bottom-color: ${dynamicColor(
    (props) => ({
      dark: props.theme.shades.dark.shade200,
      light: props.theme.color.blue100,
    }),
    true,
  )};
  margin-bottom: ${({ hasBorder }) => (hasBorder ? '16px' : 0)};
  margin-top: 16px;
`

const Logo = styled.Image`
  width: 16px;
  height: 16px;
  margin-right: 8px;
`

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 8px;
`

const Wrapper = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
  padding-right: 8px;
`

const Title = styled.Text`
  flex: 1;
  ${font({
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 17,
  })}
`

const Date = styled.Text<{ unread?: boolean }>`
  ${font({
    fontWeight: (props) => (props.unread ? '600' : '300'),
    fontSize: 13,
    lineHeight: 17,
  })}
`

const Message = styled.Text`
  padding-bottom: 8px;
  ${font({
    fontWeight: '300',
    fontSize: 16,
    lineHeight: 24,
  })}
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
              {logo && <Logo source={logo} />}
              {title && (
                <Title numberOfLines={1} ellipsizeMode="tail">
                  {title}
                </Title>
              )}
            </Wrapper>
            <Date>{date}</Date>
          </>
        )}
      </Row>
      {message && isLoading ? (
        <Skeleton active style={{ borderRadius: 4 }} height={32} />
      ) : message && !isLoading ? (
        <Message>{message}</Message>
      ) : null}
    </Host>
  )
}
