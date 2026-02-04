import React from 'react'
import { useIntl } from 'react-intl'
import { Image, ImageSourcePropType } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import calendarIcon from '../../../assets/icons/calendar.png'
import chevronForward from '../../../assets/icons/chevron-forward.png'
import locationIcon from '../../../assets/icons/location.png'
import timeOutlineIcon from '../../../assets/icons/time-outline.png'
import { Typography } from '../../../ui'
import { dynamicColor } from '../../../ui/utils/dynamic-color'
import { formatAppointmentDate } from '../formatAppointmentDate'

const Host = styled.TouchableHighlight`
  border-radius: ${({ theme }) => theme.border.radius.large};
  border-width: ${({ theme }) => theme.border.width.standard}px;
  border-color: ${dynamicColor(
    ({ theme }) => ({
      light: theme.color.blue200,
      dark: theme.shades.dark.shade400,
    }),
    true,
  )};
`

const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[2]}px;
`

const Data = styled.View`
  flex-direction: column;
  row-gap: ${({ theme }) => theme.spacing[1]}px;
  flex: 1;
`

const HeadingContainer = styled.View`
  flex-direction: column;
  row-gap: ${({ theme }) => theme.spacing.smallGutter}px;
  margin-bottom: ${({ theme }) => theme.spacing.smallGutter}px;
`

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  column-gap: ${({ theme }) => theme.spacing.smallGutter}px;
`

const IconImage = styled(Image)`
  width: 16px;
  height: 16px;
  tint-color: ${({ theme }) => theme.color.blue400};
`

const TimeAndDateCell = styled.View`
  flex-direction: row;
  align-items: center;
  column-gap: ${({ theme }) => theme.spacing.smallGutter}px;
`

const ChevronIcon = styled.View`
  margin-left: auto;
`

interface AppointmentCardProps {
  id: string
  title: string
  practitioners?: string[]
  date: string
  location?: string
  onPress(id: string): void
}

export function AppointmentCard({
  id,
  title,
  practitioners,
  date,
  location,
  onPress,
}: AppointmentCardProps) {
  const theme = useTheme()
  const intl = useIntl()

  const { weekday, date: dateStr, time } = formatAppointmentDate(intl, date)

  return (
    <Host
      onPress={() => onPress(id)}
      underlayColor={theme.shade.shade400}
      testID={`appointment-card-${id}`}
    >
      <Container>
        <Data>
          <HeadingContainer>
            <Typography variant="heading5">{title}</Typography>

            {practitioners && practitioners.length > 0 && (
              <Typography variant="body" color={theme.color.dark400}>
                {intl.formatMessage(
                  { id: 'health.appointments.practitioners' },
                  { practitioner: practitioners.join(', ') },
                )}
              </Typography>
            )}
          </HeadingContainer>

          {date && (
            <Row>
              <TimeAndDateCell>
                <IconImage source={calendarIcon as ImageSourcePropType} />
                <Typography variant="body3" color={theme.color.dark400}>
                  {weekday}, {dateStr}
                </Typography>
              </TimeAndDateCell>
              <TimeAndDateCell>
                <IconImage source={timeOutlineIcon as ImageSourcePropType} />
                <Typography variant="body3">{time}</Typography>
              </TimeAndDateCell>
            </Row>
          )}

          {location && (
            <Row>
              <IconImage source={locationIcon as ImageSourcePropType} />
              <Typography variant="body3" color={theme.color.dark400}>
                {location}
              </Typography>
            </Row>
          )}
        </Data>
        <ChevronIcon>
          <Image source={chevronForward} style={{ width: 24, height: 24 }} />
        </ChevronIcon>
      </Container>
    </Host>
  )
}
