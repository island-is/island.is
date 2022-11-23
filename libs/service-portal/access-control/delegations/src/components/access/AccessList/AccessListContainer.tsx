import { AuthCustomDelegation } from '@island.is/api/schema'
import {
  Box,
  Hidden,
  ResponsiveProp,
  Space,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { AccessDate } from '../AccessDate/AccessDate'
import { AccessList } from './AccessList'
import { AccessListLoading } from './AccessListLoading'
import { AuthScopeTree } from '../access.types'

type AccessListContainerProps = {
  delegation?: AuthCustomDelegation
  scopeTree?: AuthScopeTree
  loading?: boolean
  listMarginBottom?: ResponsiveProp<Space | 'auto'>
}

export const AccessListContainer = ({
  delegation,
  scopeTree,
  loading = false,
  listMarginBottom,
}: AccessListContainerProps) => {
  const { formatMessage } = useLocale()

  return (
    <Box display="flex" flexDirection="column" rowGap={3} marginTop={6}>
      <Box display="flex" alignItems="center" justifyContent="spaceBetween">
        <Text variant="h4" as="h4">
          {formatMessage({
            id: 'sp.access-control-delegations:access-title',
            defaultMessage: 'Réttindi',
          })}
        </Text>
        <Hidden above="md">
          {delegation?.validTo && <AccessDate validTo={delegation.validTo} />}
        </Hidden>
      </Box>
      {!loading && scopeTree && delegation ? (
        <Box marginBottom={listMarginBottom ?? [1, 1, 1]}>
          <AccessList
            validityPeriod={delegation.validTo}
            scopes={delegation.scopes}
            scopeTree={scopeTree}
          />
        </Box>
      ) : (
        <AccessListLoading rows={delegation?.scopes?.length ?? 0} />
      )}
    </Box>
  )
}
