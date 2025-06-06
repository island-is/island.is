import React from 'react'
import {
  GridRow,
  GridColumn,
  Inline,
  Icon,
  Box,
  Text,
} from '@island.is/island-ui/core'
import { LinkResolver } from '../LinkResolver/LinkResolver'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'
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

const TimeCard: React.FC<AppointmentCardProps> = ({
  title,
  description,
  data,
  size = 'small',
}) => {
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md
  const isTablet = width < theme.breakpoints.lg && !isMobile
  console.log('data', data)
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
        padding={3}
      >
        <GridRow direction="row">
          <GridColumn span={'12/12'}>
            <Box>
              <Text variant="h4" marginBottom={1} color="blue400">
                {title}
              </Text>
              <Box display="flex" justifyContent="spaceBetween" width="full">
                <Text variant="medium" marginBottom={'smallGutter'}>
                  {data.date}
                </Text>
                <Box
                  display="flex"
                  justifyContent="flexEnd"
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
                {data.location && data.location.href ? (
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
