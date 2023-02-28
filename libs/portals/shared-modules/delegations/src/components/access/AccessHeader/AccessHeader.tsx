import React from 'react'
import {
  Box,
  Hidden,
  SkeletonLoader,
  Text,
  useBreakpoint,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { AccessDate } from '../AccessDate/AccessDate'

import * as styles from './AccessHeader.css'
import { AuthCustomDelegationOutgoing } from '../../../types/customDelegation'
import { m } from '../../../lib/messages'

interface AccessHeaderProps {
  delegation?: AuthCustomDelegationOutgoing
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
    <Box
      display="flex"
      alignItems={['flexStart', 'flexStart', 'flexStart', 'flexEnd']}
      flexDirection={['columnReverse', 'columnReverse', 'columnReverse', 'row']}
      rowGap={6}
      columnGap={6}
    >
      <Box
        display="flex"
        flexDirection="column"
        rowGap={md ? 1 : 2}
        className={styles.firstColumn}
      >
        <Box
          display="flex"
          justifyContent="spaceBetween"
          alignItems="center"
          columnGap={1}
        >
          <Text variant="h3" as="h1">
            {formatMessage(m.accessScopes)}
          </Text>
          <Hidden above="md">
            {showValidityPeriodMobile && delegation?.validTo && (
              <AccessDate validTo={delegation.validTo} />
            )}
          </Hidden>
        </Box>
        {delegation ? (
          <Text variant="eyebrow">{`${delegation?.to?.name} | ${delegation?.domain.displayName}`}</Text>
        ) : (
          <SkeletonLoader width="60%" height={21} />
        )}
        <Text variant="default">{formatMessage(m.accessScopesIntro)}</Text>
      </Box>
      <div className={styles.secondColumn}>{children}</div>
    </Box>
  )
}
