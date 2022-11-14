import React from 'react'
import {
  Box,
  GridColumn,
  GridRow,
  Hidden,
  SkeletonLoader,
  Text,
  useBreakpoint,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { AuthCustomDelegation } from '@island.is/api/schema'
import { AccessDate } from '../AccessDate/AccessDate'
import * as styles from './AccessHeader.css'

interface AccessHeaderProps {
  delegation?: AuthCustomDelegation
  showValidityPeriodMobile?: boolean
  children: React.ReactNode
}

export const AccessHeader = ({
  delegation,
  children,
  showValidityPeriodMobile,
}: AccessHeaderProps) => {
  const { formatMessage } = useLocale()
  const { md } = useBreakpoint()

  return (
    <GridRow
      alignItems={['flexStart', 'flexStart', 'flexStart', 'flexEnd']}
      className={styles.row}
    >
      <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
        <Box display="flex" flexDirection="column" rowGap={md ? 1 : 2}>
          <Box
            display="flex"
            justifyContent="spaceBetween"
            alignItems="center"
            columnGap={1}
          >
            <Text variant="h3">
              {formatMessage({
                id: 'sp.access-control-delegations:access-title',
                defaultMessage: 'Réttindi',
              })}
            </Text>
            <Hidden above="md">
              {showValidityPeriodMobile && delegation?.validTo && (
                <AccessDate validTo={delegation.validTo} />
              )}
            </Hidden>
          </Box>
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
        span={['12/12', '12/12', '12/12', '7/12', '4/12']}
        className={styles.rightColumn}
      >
        {children}
      </GridColumn>
    </GridRow>
  )
}
