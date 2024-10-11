import { Typography } from '@ui'
import React, { isValidElement } from 'react'
import { FormattedDate } from 'react-intl'
import { Image, ImageSourcePropType, Pressable } from 'react-native'
import styled from 'styled-components/native'

import StarFilled from '../../../assets/icons/star-filled.png'
import Star from '../../../assets/icons/star.png'
import { dynamicColor } from '../../utils'

const Host = styled.SafeAreaView<{ unread?: boolean }>`
  flex-direction: row;
  background-color: ${dynamicColor((props) => ({
    dark: props.unread ? props.theme.shades.dark.shade300 : 'transparent',
    light: props.unread ? props.theme.color.blue100 : 'transparent',
  }))};
  border-bottom-width: ${({ theme }) => theme.border.width.standard}px;
  border-bottom-color: ${dynamicColor(
    ({ theme }) => ({
      light: theme.color.blue200,
      dark: theme.shades.dark.shade400,
    }),
    true,
  )};
`
const Icon = styled.View<{ unread?: boolean }>`
  margin-vertical: ${({ theme }) => theme.spacing[3]}px;
  margin-horizontal: ${({ theme }) => theme.spacing[2]}px;
  background-color: ${({ theme, unread }) =>
    unread ? theme.color.white : theme.color.blue100};
  height: 42px;
  width: 42px;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.border.radius.circle};
  flex-direction: column;
`

const Content = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing[3]}px;
  margin-top: ${({ theme }) => theme.spacing[3]}px;
  margin-right: ${({ theme }) => theme.spacing[2]}px;
`

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: ${({ theme }) => theme.spacing.smallGutter}px;
  gap: ${({ theme }) => theme.spacing.smallGutter}px;
`

const Title = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
  margin-bottom: ${({ theme }) => theme.spacing.smallGutter}px;
`

const Cell = styled.View``

const StarImage = styled.Image<{ active?: boolean }>`
  tint-color: ${dynamicColor(({ active, theme }) => ({
    dark: active ? theme.color.blue400 : theme.color.dark300,
    light: active ? theme.color.blue400 : theme.color.dark300,
  }))};
  width: 16px;
  height: 16px;
  margin-top: -4px;
`

interface ListItemAction {
  id: string
  text: string
  onPress(props: ListItemAction): void
}

interface ListItemProps {
  title: string
  date?: Date | string
  subtitle: string
  unread?: boolean
  actions?: ListItemAction[]
  icon?: ImageSourcePropType | React.ReactNode
  onStarPress?(): void
  starred?: boolean
}

export function ListItem({
  title,
  subtitle,
  date,
  icon,
  onStarPress,
  starred = false,
  unread = false,
}: ListItemProps) {
  return (
    <Cell>
      <Host unread={unread}>
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
        <Content>
          <Row>
            <Title>
              <Typography
                variant="body3"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {title}
              </Typography>
            </Title>
            {date && (
              <Typography variant="body3">
                <FormattedDate value={date} />
              </Typography>
            )}
          </Row>
          <Row style={{ alignItems: 'center', paddingBottom: 0 }}>
            <Typography
              variant="heading5"
              numberOfLines={1}
              style={{ flex: 1 }}
            >
              {subtitle}
            </Typography>
            <Pressable hitSlop={16} onPress={onStarPress}>
              <StarImage
                source={starred ? StarFilled : Star}
                active={starred}
              />
            </Pressable>
          </Row>
        </Content>
      </Host>
    </Cell>
  )
}
