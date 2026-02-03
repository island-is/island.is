import { AuthDelegationScope } from '@island.is/api/schema'
import {
  Box,
  Hidden,
  ResponsiveProp,
  Space,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { AccessDate } from '../../AccessDate/AccessDate'
import { AccessList } from '../AccessList'
import { AccessListLoading } from '../AccessListLoading'
import { AuthScopeTree } from '../../access.types'
import { m } from '../../../../lib/messages'

type DelegationScope = Pick<
  AuthDelegationScope,
  'id' | 'name' | 'displayName' | 'validTo' | 'validFrom'
> & {
  domain?: {
    displayName?: string
    organisationLogoUrl?: string | null
    organisationLogoKey?: string
  } | null
  apiScope?: {
    name?: string
    displayName?: string
    description?: string | null
  } | null
}

type AccessListContainerProps = {
  delegation?: {
    validTo?: string | null
    scopes?: DelegationScope[]
  }
  scopeTree?: AuthScopeTree
  scopes?: Pick<AuthDelegationScope, 'name' | 'validTo' | 'displayName'>[]
  loading?: boolean
  listMarginBottom?: ResponsiveProp<Space | 'auto'>
  validityPeriod?: Date | null
}

export const AccessListContainer = ({
  delegation,
  scopeTree,
  scopes,
  loading = false,
  listMarginBottom,
  validityPeriod,
}: AccessListContainerProps) => {
  const { formatMessage } = useLocale()
  const showAccessList = !loading && scopeTree && scopes && delegation

  return (
    <Box display="flex" flexDirection="column" rowGap={3} marginTop={6}>
      <Box display="flex" alignItems="center" justifyContent="spaceBetween">
        <Text variant="h4" as="h4">
          {formatMessage(m.accessScopes)}
        </Text>
        <Hidden above="md">
          {delegation?.validTo && <AccessDate validTo={delegation.validTo} />}
        </Hidden>
      </Box>
      <Box marginBottom={listMarginBottom ?? 1}>
        {showAccessList ? (
          <AccessList
            validityPeriod={validityPeriod ?? delegation.validTo}
            scopes={scopes}
            scopeTree={scopeTree}
          />
        ) : (
          <AccessListLoading rows={delegation?.scopes?.length ?? 0} />
        )}
      </Box>
    </Box>
  )
}
