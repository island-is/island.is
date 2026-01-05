import {
  Box,
  GridColumn,
  GridRow,
  Icon,
  Inline,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useWindowSize } from 'react-use'
import { LinkButton } from '../LinkButton/LinkButton'
import { LinkResolver } from '../LinkResolver/LinkResolver'
import * as styles from './InfoCard.css'
interface AppointmentCardProps {
  title: string
  description: string
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
//       href: HealthPaths.HealthCenter,
//     },
//   },
// },

export const TimeCard = ({
  title,
  description,
  data,
  to,
}: AppointmentCardProps) => {
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md

  if (!data) return

  const content = (
    <GridRow direction="row">
      <GridColumn span={'12/12'}>
        <Box>
          <Text variant="h4" marginBottom={1} color="blue400">
            {title}
          </Text>
          <Box
            display="flex"
            justifyContent="spaceBetween"
            width="full"
            flexDirection={isMobile ? 'column' : 'row'}
          >
            <Text variant="medium" marginBottom={'smallGutter'}>
              {data.weekday ? data.weekday + ', ' : ''}
              {data.date}
            </Text>
            <Box
              display="flex"
              justifyContent={isMobile ? 'flexStart' : 'flexEnd'}
              alignItems="center"
              columnGap={1}
              marginBottom={'smallGutter'}
            >
              <Icon icon="time" color="blue400" size="small" type="outline" />
              <Text variant="medium">{data.time}</Text>
            </Box>
          </Box>
          <Inline space={1}>
            <Text variant="medium" marginBottom="smallGutter">
              {description}
            </Text>
          </Inline>
          <Inline>
            {data.location?.href ? (
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
                  icon="link"
                />
              </Box>
            ) : (
              <Text variant="medium">{data.location.label}</Text>
            )}
          </Inline>
        </Box>
      </GridColumn>
    </GridRow>
  )
  return (
    <Box>
      <Box
        border="standard"
        borderColor="blue200"
        borderRadius="large"
        padding={isMobile ? 2 : 3}
        className={styles.boxContainer}
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
