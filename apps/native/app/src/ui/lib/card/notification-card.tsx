import React, { isValidElement } from 'react'
import { FormattedDate } from 'react-intl'
import { Image, ImageSourcePropType } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import { token } from '../../utils/dynamic-color'
import { Typography } from '../typography/typography'

const Host = styled.TouchableHighlight<{ unread?: boolean }>`
  background-color: ${({ theme, unread }) =>
    unread ? theme.tokens.background.brandMinimal : 'transparent'};
`

const Cell = styled.View`
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
  padding-vertical: ${({ theme }) => theme.spacing[3]}px;
  border-bottom-width: ${({ theme }) => theme.border.width.standard}px;
  border-bottom-color: ${token((t) => t.border.primary)};
`

const Container = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  column-gap: ${({ theme }) => theme.spacing[2]}px;
`

const Heading = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-start;
`

const Icon = styled.View<{ unread?: boolean }>`
  background-color: ${({ theme, unread }) =>
    unread
      ? theme.tokens.background.invert
      : theme.tokens.background.brandMinimal};
  height: 42px;
  width: 42px;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.border.radius.full};
  flex-direction: column;
`

const Row = styled.View`
  flex-direction: column;
  flex: 1;
  row-gap: ${({ theme }) => theme.spacing.smallGutter}px;
`

interface CardProps {
  id: number | string
  icon?: ImageSourcePropType | React.ReactNode
  date?: Date
  title: string
  message: string
  unread?: boolean
  actions?: Array<{ text: string; onPress(id: string | number): void }>
  testID?: string
  onPress(id: number | string): void
}

export function NotificationCard({
  id,
  onPress,
  title,
  message,
  date,
  icon,
  unread,
  testID,
}: CardProps) {
  const theme = useTheme()
  return (
    <Host
      onPress={() => onPress(id)}
      underlayColor={theme.tokens.app.background.pressed}
      activeOpacity={1}
      unread={unread}
      testID={testID}
    >
      <Cell>
        <Container>
          {icon && isValidElement(icon) ? (
            icon
          ) : icon ? (
            <Icon unread={unread}>
              <Image
                source={icon as ImageSourcePropType}
                style={{ width: 24, height: 24 }}
              />
            </Icon>
          ) : null}
          <Row>
            <Heading>
              <Typography variant="heading5" style={{ flex: 1 }}>
                {title}
              </Typography>
              {date && (
                <Typography variant="body3">
                  <FormattedDate value={date} />
                </Typography>
              )}
            </Heading>
            <Typography>{message}</Typography>
          </Row>
        </Container>
      </Cell>
    </Host>
  )
}
