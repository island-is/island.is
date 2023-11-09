import { useLocale, useNamespaces } from '@island.is/localization'
import { DynamicWrapper, m } from '@island.is/service-portal/core'

import { Box } from '@island.is/island-ui/core'
import FinanceIntro from '../../components/FinanceIntro'
import { useGetHmsLoansLoanOverviewQuery } from './FinanceLoans.generated'

const FinanceBills = () => {
  useNamespaces('sp.finance-loans')
  const { formatMessage } = useLocale()

  const {
    data: loanOverviewData,
    loading: loanOverviewLoading,
    error: loanOverviewError,
  } = useGetHmsLoansLoanOverviewQuery()

  console.log({ loanOverviewData })

  return (
    <Box marginTop={[1, 1, 2, 2, 4]} marginBottom={[6, 6, 10]}>
      <FinanceIntro
        text={formatMessage({
          id: 'sp.finance-loans:intro',
          defaultMessage: 'Virk lán hjá HMS',
        })}
      />
    </Box>
  )
}

export default FinanceBills
