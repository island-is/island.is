import React from 'react'
import {
  Box,
  Text,
  Icon,
  GridColumn,
  GridRow,
  Inline,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import * as styles from './InfoCard.css'

interface NoAccessCardProps {
  title?: string
  description?: string
}

/**
 * Shown in place of an InfoCard when the user is missing the delegation scope
 * the card's data requires.
 */
export const NoAccessCard: React.FC<NoAccessCardProps> = ({
  title,
  description,
}) => {
  const { formatMessage } = useLocale()

  return (
    <Box className={styles.container}>
      <Box className={styles.containerLink}>
        <Box
          border="standard"
          borderColor="blue200"
          borderRadius="large"
          padding={3}
          className={styles.boxContainer}
          height="full"
          background="white"
        >
          <GridRow direction="row" className={styles.gridRow}>
            <GridColumn span={'11/12'} className={styles.contentContainer}>
              <Box
                display="flex"
                justifyContent="spaceBetween"
                flexGrow={1}
                marginBottom={0}
              >
                <Box>
                  <Text variant="h4" marginBottom={1} color="blue400">
                    {title ?? formatMessage(m.accessNeeded)}
                  </Text>
                  <Inline>
                    <Text>
                      {description ?? formatMessage(m.accessDeniedText)}
                    </Text>
                  </Inline>
                </Box>
              </Box>
            </GridColumn>

            <GridColumn span="1/12" className={styles.icon}>
              <Box
                display="flex"
                justifyContent="flexEnd"
                alignItems="flexStart"
              >
                <Icon icon="lockClosed" type="outline" color="blue400" />
              </Box>
            </GridColumn>
          </GridRow>
        </Box>
      </Box>
    </Box>
  )
}
