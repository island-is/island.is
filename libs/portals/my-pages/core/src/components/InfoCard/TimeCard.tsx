import { Box, GridColumn, GridRow, Icon, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import cn from 'classnames'
import { useWindowSize } from 'react-use'
import { LinkButton } from '../LinkButton/LinkButton'
import { LinkResolver } from '../LinkResolver/LinkResolver'
import * as styles from './InfoCard.css'
interface AppointmentCardProps {
  title: string
  description?: string
  data?: {
    date: string
    time: string
    weekday?: string
    location: {
      label: string
      href?: string
    }
  }
  size?: 'small' | 'large'
  to?: string
  /** Grays out the card, e.g. for appointments that have already passed */
  muted?: boolean
}

// Example of a timecard
// {
//   title: 'Mæðravernd',
//   description: 'Tími hjá: Sigríður Gunnarsdóttir',
//   appointment: {
//     date: 'Fimmtudaginn, 03.04.2025',
//     time: '11:40',
//     location: {
//       label: 'Heilsugæslan við Ásbrú',
//     },
//   },
// },

export const TimeCard = ({
  title,
  description,
  data,
  to,
  muted = false,
}: AppointmentCardProps) => {
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md

  if (!data) return

  const content = (
    <GridRow direction="row">
      <GridColumn span={'12/12'}>
        <Box
          display="flex"
          justifyContent="spaceBetween"
          alignItems="center"
          marginBottom={2}
        >
          <Text
            variant="h4"
            color={to && !muted ? 'blue400' : undefined}
            className={muted ? styles.mutedTitle : undefined}
          >
            {title}
          </Text>
          {to && <Icon icon="arrowForward" type="outline" color="blue400" />}
        </Box>
        <Box
          display="flex"
          columnGap={3}
          rowGap={1}
          flexDirection={isMobile ? 'column' : 'row'}
          marginBottom={1}
        >
          <Box display="flex" alignItems="flexStart" columnGap={1}>
            <Box flexShrink={0} paddingTop="smallGutter">
              <Icon
                icon="calendar"
                color="blue400"
                size="small"
                type="outline"
              />
            </Box>
            <Text>
              {data.weekday ? data.weekday + ', ' : ''}
              {data.date}
            </Text>
          </Box>
          <Box display="flex" alignItems="flexStart" columnGap={1}>
            <Box flexShrink={0} paddingTop="smallGutter">
              <Icon icon="time" color="blue400" size="small" type="outline" />
            </Box>
            <Text>{data.time}</Text>
          </Box>
        </Box>
        {description && (
          <Box
            display="flex"
            alignItems="flexStart"
            columnGap={1}
            marginBottom={1}
          >
            <Box flexShrink={0} paddingTop="smallGutter">
              <Icon icon="person" color="blue400" size="small" type="outline" />
            </Box>
            <Text>{description}</Text>
          </Box>
        )}
        {data.location?.label && (
          <Box display="flex" alignItems="flexStart" columnGap={1}>
            <Box flexShrink={0} paddingTop="smallGutter">
              <Icon
                icon="location"
                color="blue400"
                size="small"
                type="outline"
              />
            </Box>
            {data.location.href ? (
              <Box
                onClick={(e) => {
                  // Stop propagation to prevent parent card link from triggering
                  e.stopPropagation()
                }}
                style={{ position: 'relative', zIndex: 1 }}
              >
                <LinkButton
                  variant="text"
                  to={data.location.href}
                  text={data.location.label}
                  size="small"
                />
              </Box>
            ) : (
              <Text>{data.location.label}</Text>
            )}
          </Box>
        )}
      </GridColumn>
    </GridRow>
  )
  return (
    <Box height="full">
      <Box
        border="standard"
        borderColor="blue200"
        borderRadius="large"
        padding={isMobile ? 2 : 3}
        height="full"
        className={cn(to && styles.boxContainer, muted && styles.mutedCard)}
      >
        {to ? (
          <LinkResolver href={to}>
            <Box className={styles.containerLink}>{content}</Box>
          </LinkResolver>
        ) : (
          <Box className={styles.containerLink}>{content}</Box>
        )}
      </Box>
    </Box>
  )
}

export default TimeCard
