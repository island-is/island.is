import React from 'react'
import { FormattedDate } from 'react-intl'
import { Image, ImageSourcePropType, View, ViewStyle } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import chevronForward from '../../assets/icons/chevron-forward.png'
import timeOutlineIcon from '../../assets/card/time-outline.png'
import { PressableHighlight } from '../../../components/pressable-highlight/pressable-highlight'
import { dynamicColor } from '../../utils/dynamic-color'
import { Typography } from '../typography/typography'
import { Tag } from '../tag/tag'
import { Badge } from '../badge/badge'

export type QuestionnaireStatus = 'answered' | 'unanswered'

export type QuestionnaireCardAction = {
  text: string
  onPress(): void
  icon?: ImageSourcePropType
}

interface QuestionnaireCardProps {
  title: string
  organization: string
  date: Date
  status: QuestionnaireStatus
  statusLabel: string
  onPress?(): void
  actionList?: QuestionnaireCardAction[]
  style?: ViewStyle
}

const Host = styled.View`
  width: 100%;
  border-radius: ${({ theme }) => theme.border.radius.large};
  border-width: ${({ theme }) => theme.border.width.standard}px;
  border-color: ${dynamicColor(({ theme }) => ({
    light: theme.color.blue200,
    dark: theme.shades.dark.shade300,
  }))};
  background-color: ${({ theme }) => theme.color.white};
  overflow: hidden;
`

const PressableContent = styled.View`
  padding: ${({ theme }) => theme.spacing[2]}px;
`

const TopRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const TitleText = styled(Typography)`
  flex: 1;
`

const DateRow = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.smallGutter}px;
`

const ActionsContainer = styled.View`
  justify-content: center;
  align-items: center;
  border-top-width: ${({ theme }) => theme.border.width.standard}px;
  border-top-color: ${dynamicColor((props) => ({
    light: props.theme.color.blue200,
    dark: props.theme.shades.dark.shade300,
  }))};
  flex-direction: row;
`

const ActionButton = styled.TouchableOpacity<{ $border: boolean }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing[2]}px;
  border-left-width: ${({ theme }) => theme.border.width.standard}px;
  border-left-color: ${dynamicColor(
    ({ theme, $border }) => (!$border ? 'transparent' : theme.color.blue200),
    true,
  )};
`

const ActionContent = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  column-gap: ${({ theme }) => theme.spacing[1]}px;
`

export function QuestionnaireCard({
  title,
  organization,
  date,
  status,
  statusLabel,
  onPress,
  actionList = [],
  style,
}: QuestionnaireCardProps) {
  const theme = useTheme()

  return (
    <Host style={style}>
      <PressableHighlight
        onPress={onPress}
        disabled={!onPress}
        highlightColor={
          theme.isDark ? theme.shades.dark.shade100 : theme.color.blue100
        }
        style={{ borderRadius: theme.border.radius.large }}
      >
        <PressableContent>
          <TopRow>
            <Typography variant="eyebrow" color={theme.color.purple400}>
              {organization}
            </Typography>
          </TopRow>

          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View style={{ gap: theme.spacing[1] }}>
              <TitleText variant="heading4">{title}</TitleText>
              <DateRow>
                <Image
                  source={timeOutlineIcon as ImageSourcePropType}
                  style={{
                    width: 16,
                    height: 16,
                    marginRight: theme.spacing.smallGutter,
                  }}
                />
                <Typography variant="body3">
                  <FormattedDate value={date} />
                </Typography>
              </DateRow>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: theme.spacing[1],
              }}
            >
              <Badge title={statusLabel} outlined={true} variant={'blue'} />
              <Image
                source={chevronForward}
                style={{ width: 24, height: 24 }}
              />
            </View>
          </View>
        </PressableContent>
      </PressableHighlight>

      {actionList.length ? (
        <ActionsContainer>
          {actionList.map(({ text, onPress: actionPress, icon }, i) => (
            <ActionButton onPress={actionPress} key={i} $border={i !== 0}>
              <ActionContent>
                <Typography variant="heading5" color={theme.color.blue400}>
                  {text}
                </Typography>
                {icon ? <Image source={icon} /> : null}
              </ActionContent>
            </ActionButton>
          ))}
        </ActionsContainer>
      ) : null}
    </Host>
  )
}
