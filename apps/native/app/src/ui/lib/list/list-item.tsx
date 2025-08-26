import React, { isValidElement } from 'react'
import { FormattedDate, useIntl } from 'react-intl'
import { Image, ImageSourcePropType, Pressable, View } from 'react-native'
import styled from 'styled-components/native'

import starFilledIcon from '../../../assets/icons/star-filled.png'
import checkmarkIcon from '../../assets/icons/checkmark.png'
import { dynamicColor } from '../../utils'
import { Icon as UIIcon } from '../icon/icon'
import { Label } from '../label/label'
import { Typography } from '../typography/typography'

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
const Icon = styled.View<{
  unread?: boolean
  selectable?: boolean
  selected?: boolean
}>`
  margin-vertical: ${({ theme }) => theme.spacing[3]}px;
  margin-horizontal: ${({ theme }) => theme.spacing[2]}px;
  background-color: ${({ theme, unread }) =>
    unread ? theme.color.white : theme.color.blue100};
  height: 42px;
  width: 42px;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.border.radius.full};
  flex-direction: column;
  border: ${({ theme, selectable, selected }) =>
      selectable && !selected ? theme.border.width.standard : 0}px
    solid ${({ theme }) => theme.color.blue200};
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

const LowerRow = styled(Row)`
  align-items: center;
  padding-bottom: 0;
`

const Title = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
  margin-bottom: ${({ theme }) => theme.spacing.smallGutter}px;
`

const SubtitleWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  flex-shrink: 1;
  column-gap: ${({ theme }) => theme.spacing.smallGutter}px;
`

const Cell = styled.View``

const StarImage = styled.Image<{ active?: boolean }>`
  tint-color: ${dynamicColor(({ active, theme }) => ({
    dark: active ? theme.color.blue400 : theme.color.dark300,
    light: active ? theme.color.blue400 : theme.color.dark300,
  }))};
  width: 16px;
  height: 16px;
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
  starred?: boolean
  urgent?: boolean
  replyable?: boolean
  selectable?: boolean
  selected?: boolean
  onPressIcon?: () => void
}

export function ListItem({
  title,
  subtitle,
  date,
  icon,
  unread = false,
  urgent = false,
  starred = false,
  selectable = false,
  selected = false,
  replyable = false,
  onPressIcon,
}: ListItemProps) {
  const intl = useIntl()
  return (
    <Cell>
      <Host unread={unread}>
        {icon && isValidElement(icon) ? (
          icon
        ) : icon ? (
          <Icon unread={unread} selectable={selectable} selected={selected}>
            {!selectable && !selected && (
              <Pressable hitSlop={24} onPress={onPressIcon}>
                <Image
                  source={icon as ImageSourcePropType}
                  style={{ width: 24, height: 24 }}
                />
              </Pressable>
            )}
            {selectable && selected && (
              <Image source={checkmarkIcon} style={{ width: 50, height: 50 }} />
            )}
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
          <LowerRow>
            <SubtitleWrapper>
              <Typography variant="heading5" numberOfLines={1}>
                {subtitle}
              </Typography>
            </SubtitleWrapper>
            {replyable && (
              <UIIcon
                source={require('../../../assets/icons/reply.png')}
                width={12}
                height={12}
                tintColor="dark300"
              />
            )}
            <View style={{ flex: 1 }} />
            {starred && <StarImage source={starFilledIcon} active={starred} />}
            {urgent && (
              <Label color="urgent" icon>
                {intl.formatMessage({ id: 'inbox.urgent' })}
              </Label>
            )}
          </LowerRow>
        </Content>
      </Host>
    </Cell>
  )
}
