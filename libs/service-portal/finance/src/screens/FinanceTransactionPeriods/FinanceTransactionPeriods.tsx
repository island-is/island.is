import { Box } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  DynamicWrapper,
  FJARSYSLAN_SLUG,
  FootNote,
} from '@island.is/service-portal/core'

import { FinanceTransactionPeriodsProvider } from '../../components/FinanceTransactionPeriods/FinanceTransactionPeriodsContext'
import FinanceTransactionPeriodsFilter from '../../components/FinanceTransactionPeriods/FinanceTransactionPeriodsFilter'

const FinanceTransactionPeriods = () => {
  useNamespaces('sp.finance-transaction-periods')
  return (
    <DynamicWrapper>
      <FinanceTransactionPeriodsProvider>
        <FinanceTransactionPeriodsFilter />
      </FinanceTransactionPeriodsProvider>
      <FootNote serviceProviderSlug={FJARSYSLAN_SLUG} />
    </DynamicWrapper>
  )
}

export default FinanceTransactionPeriods
