import React from 'react'
import {
  Box,
  Text,
  Icon,
  GridColumn,
  GridRow,
  Inline,
} from '@island.is/island-ui/core'
import LinkResolver from '../LinkResolver/LinkResolver'
import * as styles from './InfoCard.css'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/portals/core'

interface ErrorCardProps {
  title?: string
  description?: string
  to?: string
}

export const ErrorCard: React.FC<ErrorCardProps> = ({
  title,
  description,
  to,
}) => {
  const { formatMessage } = useLocale()
  const content = (
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
                {title ?? formatMessage(m.errorFetch)}
              </Text>
              <Inline>
                <Text>{description ?? formatMessage(m.errorFetch)}</Text>
              </Inline>
            </Box>
          </Box>
        </GridColumn>

        <GridColumn span="1/12" className={styles.icon}>
          <Box display="flex" justifyContent="flexEnd" alignItems="flexStart">
            <Icon icon="reload" type="outline" color="blue400" />
          </Box>
        </GridColumn>
      </GridRow>
    </Box>
  )
  return (
    <Box className={styles.container}>
      {to ? (
        <LinkResolver href={to} className={styles.containerLink}>
          {content}
        </LinkResolver>
      ) : (
        <Box className={styles.containerLink}>{content}</Box>
      )}
    </Box>
  )
}
