import { useLocale, useNamespaces } from '@island.is/localization'

import { Box, SkeletonLoader } from '@island.is/island-ui/core'
import { m } from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { FinanceLoansTable } from '../../components/FinanceLoans/FinanceLoansTable'
import { useGetHmsLoansHistoryQuery } from './FinanceLoans.generated'

const FinanceLoans = () => {
  useNamespaces('sp.finance-loans')
  const { formatMessage } = useLocale()

  const {
    data: loanOverviewData,
    loading: loanOverviewLoading,
    error: loanOverviewError,
    called: loanOverviewCalled,
  } = useGetHmsLoansHistoryQuery()

  return (
    <Box marginTop={[1, 1, 2, 2, 4]} marginBottom={[6, 6, 10]}>
      <Box marginTop={2}>
        {loanOverviewError && loanOverviewCalled && !loanOverviewLoading && (
          <Problem error={loanOverviewError} noBorder={false} />
        )}
        {(loanOverviewLoading || !loanOverviewCalled) && !loanOverviewError && (
          <Box padding={3}>
            <SkeletonLoader space={1} height={40} repeat={5} />
          </Box>
        )}
        {!loanOverviewData?.hmsLoansHistory?.length &&
          loanOverviewCalled &&
          !loanOverviewLoading &&
          !loanOverviewError && (
            <Problem
              type="no_data"
              noBorder={false}
              title={formatMessage(m.noData)}
              message={formatMessage(m.noTransactionFound)}
              imgSrc="./assets/images/sofa.svg"
              imgAlt=""
            />
          )}
        {loanOverviewData?.hmsLoansHistory?.length ? (
          <FinanceLoansTable loanOverview={loanOverviewData.hmsLoansHistory} />
        ) : null}
      </Box>
    </Box>
  )
}

export default FinanceLoans
