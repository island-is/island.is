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
      padding={[2, 2, 3]}
      className={to ? styles.boxContainer : undefined}
      height="full"
      background="white"
    >
      <GridRow direction="row" className={styles.gridRow}>
        <GridColumn span="12/12" className={styles.contentContainer}>
          <Box
            display="flex"
            justifyContent="spaceBetween"
            alignItems="center"
            columnGap={2}
            marginBottom={1}
          >
            <Text variant="h4" color="blue400">
              {title ?? formatMessage(m.errorFetch)}
            </Text>
            <Box flexShrink={0} display="flex">
              <Icon icon="reload" type="outline" color="blue400" />
            </Box>
          </Box>
          <Inline>
            <Text>{description ?? formatMessage(m.errorFetch)}</Text>
          </Inline>
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
