import React from 'react'
import * as styles from './AppointmentCard.css'
import {
  GridRow,
  GridColumn,
  Inline,
  Icon,
  Box,
  Text,
} from '@island.is/island-ui/core'
import { LinkResolver } from '@island.is/portals/my-pages/core'

interface AppointmentCardProps {
  title: string
  date: string
  description: string
  time: string
  location: { label: string; href?: string }
  size?: 'small' | 'large'
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  title,
  date,
  description,
  time,
  location,
  size = 'small',
}) => {
  return (
    <Box style={{ width: size === 'small' ? '49%' : '100%' }}>
      <Box
        border="standard"
        borderColor="blue200"
        borderRadius="large"
        padding={3}
        className={styles.containar}
      >
        <GridRow direction="row">
          <GridColumn span={'12/12'}>
            <Box>
              <Text variant="h4" marginBottom={1} color="blue400">
                {title}
              </Text>
              <Box display="flex" justifyContent="spaceBetween" width="full">
                <Text variant="medium">{date}</Text>
                <Box
                  display="flex"
                  justifyContent="flexEnd"
                  alignItems="center"
                  columnGap={1}
                >
                  <Icon
                    icon="time"
                    color="blue400"
                    size="small"
                    type="outline"
                  />
                  <Text variant="medium">{time}</Text>
                </Box>
              </Box>
              <Inline space={1}>
                <Text variant="medium">{description}</Text>
              </Inline>
              <Inline>
                {location && location.href ? (
                  <LinkResolver href={location.href} label={location.label}>
                    <Text variant="medium" color="blue400">
                      {location.label}
                    </Text>
                  </LinkResolver>
                ) : (
                  <Text variant="medium">{location.label}</Text>
                )}
              </Inline>
            </Box>
          </GridColumn>
        </GridRow>
      </Box>
    </Box>
  )
}

export default AppointmentCard
