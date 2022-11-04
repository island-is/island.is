import {
  Box,
  GridColumn,
  GridRow,
  SkeletonLoader,
  Text,
  useBreakpoint,
} from '@island.is/island-ui/core'
import { NotFound } from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { IdentityCard } from '../../components/IdentityCard/IdentityCard'
import { useDelegation } from '../../hooks/useDelegation'
import * as styles from '../Access/Access.css'

const AccessToMe = () => {
  useNamespaces(['sp.settings-access-control', 'sp.access-control-delegations'])
  const { md } = useBreakpoint()
  const { formatMessage } = useLocale()
  const { delegation, loading } = useDelegation()

  if (!loading && !delegation) {
    return <NotFound />
  }

  return (
    <Box
      marginTop={[3, 3, 3, 4]}
      display="flex"
      rowGap={5}
      flexDirection="column"
    >
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
          className={styles.checkboxColumn}
        >
          {delegation && (
            <IdentityCard
              label={formatMessage({
                id: 'sp.access-control-delegations:domain',
                defaultMessage: 'Kerfi',
              })}
              title={delegation.domain.name}
              imgSrc={delegation.domain.organisationLogoUrl}
            />
          )}
        </GridColumn>
      </GridRow>
      {delegation ? (
        // <AccessForm
        //   delegation={authDelegation}
        //   validityPeriod={validityPeriod}
        // />
        <div>test</div>
      ) : (
        <SkeletonLoader width="100%" height={250} />
      )}
    </Box>
  )
}

export default AccessToMe
