import {
  Box,
  GridColumn,
  GridRow,
  Icon,
  Inline,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import React from 'react'
import { useWindowSize } from 'react-use'
import { LinkResolver } from '../LinkResolver/LinkResolver'
import EmptyCard from './EmptyCard'

interface AppointmentCardProps {
  title: string
  description: string
  data?: {
    date: string
    time: string
    location: {
      label: string
      href?: string
    }
  }
  size?: 'small' | 'large'
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

const TimeCard: React.FC<AppointmentCardProps> = ({
  title,
  description,
  data,
}) => {
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md
  if (!data) {
    return (
      <EmptyCard
        title={title}
        description={description}
        size={'large'}
        img="./assets/images/sofa.svg"
      />
    )
  }
  return (
    <Box>
      <Box
        border="standard"
        borderColor="blue200"
        borderRadius="large"
        padding={isMobile ? 2 : 3}
      >
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
                  {data.date}
                </Text>
                <Box
                  display="flex"
                  justifyContent={isMobile ? 'flexStart' : 'flexEnd'}
                  alignItems="center"
                  columnGap={1}
                  marginBottom={'smallGutter'}
                >
                  <Icon
                    icon="time"
                    color="blue400"
                    size="small"
                    type="outline"
                  />
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
                  <LinkResolver
                    href={data.location.href}
                    label={data.location.label}
                  >
                    <Text variant="medium" color="blue400">
                      {data.location.label}
                    </Text>
                  </LinkResolver>
                ) : (
                  <Text variant="medium">{data.location.label}</Text>
                )}
              </Inline>
            </Box>
          </GridColumn>
        </GridRow>
      </Box>
    </Box>
  )
}

export default TimeCard
