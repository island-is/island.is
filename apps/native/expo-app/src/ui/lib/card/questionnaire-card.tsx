import React from 'react'
import { FormattedDate, useIntl } from 'react-intl'
import { Image, ImageSourcePropType, ViewStyle } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { PressableHighlight } from '../../../components/pressable-highlight/pressable-highlight'
import { QuestionnaireQuestionnairesStatusEnum } from '../../../graphql/types/schema'
import timeOutlineIcon from '../../assets/card/time-outline.png'
import chevronForward from '../../assets/icons/chevron-forward.png'
import { dynamicColor } from '../../utils/dynamic-color'
import { Badge } from '../badge/badge'
import { Typography } from '../typography/typography'
import { getQuestionnaireStatusLabelId } from '../../../app/(auth)/(tabs)/health/questionnaires/_utils/questionnaire-utils'

export type QuestionnaireCardAction = {
  text: string
  onPress(): void
  icon?: ImageSourcePropType
}

interface QuestionnaireCardProps {
  title: string
  organization: string
  date: Date
  status: QuestionnaireQuestionnairesStatusEnum
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
  flex-shrink: 1;
  flex-wrap: wrap;
`

const DateRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.smallGutter}px;
`

const ContentRow = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const LeftContent = styled.View`
  flex: 1;
  flex-shrink: 1;
  min-width: 0px;
`

const RightContent = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.smallGutter}px;
  flex-shrink: 0;
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

const calculateBadgeVariant = (
  status: QuestionnaireQuestionnairesStatusEnum,
) => {
  switch (status) {
    case QuestionnaireQuestionnairesStatusEnum.NotAnswered:
    case QuestionnaireQuestionnairesStatusEnum.Draft:
      return 'purple'
    case QuestionnaireQuestionnairesStatusEnum.Expired:
      return 'red'
    default:
      return 'blue'
  }
}

export function QuestionnaireCard({
  title,
  organization,
  date,
  status,
  onPress,
  actionList = [],
  style,
}: QuestionnaireCardProps) {
  const theme = useTheme()
  const intl = useIntl()
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

          <ContentRow>
            <LeftContent style={{ gap: theme.spacing[1] }}>
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
            </LeftContent>
            <RightContent>
              <Badge
                title={intl.formatMessage({
                  id: getQuestionnaireStatusLabelId(status),
                })}
                outlined={false}
                fill={true}
                variant={calculateBadgeVariant(status)}
              />
              <Image
                source={chevronForward}
                style={{ width: 24, height: 24 }}
              />
            </RightContent>
          </ContentRow>
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
