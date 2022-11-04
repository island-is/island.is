import React from 'react'
import {
  Box,
  GridColumn,
  GridRow,
  SkeletonLoader,
  Text,
  useBreakpoint,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import * as styles from './AccessHeader.css'
import { AuthCustomDelegation } from '@island.is/api/schema'

interface AccessHeaderProps {
  delegation?: AuthCustomDelegation
  children: React.ReactNode
}

export const AccessHeader = ({ delegation, children }: AccessHeaderProps) => {
  const { formatMessage } = useLocale()
  const { md } = useBreakpoint()
  return (
    <GridRow
      alignItems={['flexStart', 'flexStart', 'flexStart', 'flexEnd']}
      className={styles.row}
    >
      <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
        <Box display="flex" flexDirection="column" rowGap={md ? 1 : 2}>
          <Text variant="h3">
            {formatMessage({
              id: 'sp.access-control-delegations:access-title',
              defaultMessage: 'Réttindi',
            })}
          </Text>
          {delegation ? (
            <Text variant="eyebrow">{`${delegation?.to?.name} • ${delegation?.domain.displayName}`}</Text>
          ) : (
            <SkeletonLoader width="60%" height={21} />
          )}
          <Text variant="default">
            {formatMessage({
              id: 'sp.settings-access-control:access-intro',
              defaultMessage:
                'Reyndu að lágmarka þau réttindi sem þú vilt veita viðkomandi eins mikið og mögulegt er.',
            })}
          </Text>
        </Box>
      </GridColumn>
      <GridColumn
        span={['12/12', '12/12', '12/12', '5/12', '4/12']}
        className={styles.rightColumn}
      >
        {children}
      </GridColumn>
    </GridRow>
  )
}
