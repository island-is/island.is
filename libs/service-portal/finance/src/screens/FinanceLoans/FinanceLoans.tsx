import { useLocale, useNamespaces } from '@island.is/localization'

import { AlertBanner, Box, SkeletonLoader } from '@island.is/island-ui/core'
import { m } from '@island.is/service-portal/core'
import FinanceIntro from '../../components/FinanceIntro'
import { useGetHmsLoansLoanhistoryQuery } from './FinanceLoans.generated'
import { FinanceLoansTable } from '../../components/FinanceLoans/FinanceLoansTable'

const FinanceLoans = () => {
  useNamespaces('sp.finance-loans')
  const { formatMessage } = useLocale()

  const {
    data: loanOverviewData,
    loading: loanOverviewLoading,
    error: loanOverviewError,
    called: loanOverviewCalled,
  } = useGetHmsLoansLoanhistoryQuery()

  return (
    <Box marginTop={[1, 1, 2, 2, 4]} marginBottom={[6, 6, 10]}>
      <FinanceIntro
        text={formatMessage({
          id: 'sp.finance-loans:intro',
          defaultMessage: 'Virk lán hjá HMS',
        })}
      />
      <Box marginTop={2}>
        {loanOverviewError && (
          <AlertBanner
            description={formatMessage(m.errorFetch)}
            variant="error"
          />
        )}
        {(loanOverviewLoading || !loanOverviewCalled) && !loanOverviewError && (
          <Box padding={3}>
            <SkeletonLoader space={1} height={40} repeat={5} />
          </Box>
        )}
        {!loanOverviewData?.hmsLoansLoanhistory?.length &&
          loanOverviewCalled &&
          !loanOverviewLoading &&
          !loanOverviewError && (
            <AlertBanner
              description={formatMessage(m.noResultsTryAgain)}
              variant="warning"
            />
          )}
        {loanOverviewData?.hmsLoansLoanhistory?.length ? (
          <FinanceLoansTable
            loanOverview={loanOverviewData.hmsLoansLoanhistory}
          />
        ) : null}
      </Box>
    </Box>
  )
}

export default FinanceLoans
