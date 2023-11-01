import { Box } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  DynamicWrapper,
  FJARSYSLAN_ID,
  FootNote,
} from '@island.is/service-portal/core'

import FinanceIntro from '../../components/FinanceIntro'
import { FinanceTransactionPeriodsProvider } from '../../components/FinanceTransactionPeriods/FinanceTransactionPeriodsContext'
import FinanceTransactionPeriodsFilter from '../../components/FinanceTransactionPeriods/FinanceTransactionPeriodsFilter'

const FinanceTransactionPeriods = () => {
  useNamespaces('sp.finance-transaction-periods')
  const { formatMessage } = useLocale()

  return (
    <DynamicWrapper>
      <FinanceTransactionPeriodsProvider>
        <Box marginTop={[1, 1, 2, 2, 4]} marginBottom={[6, 6, 10]}>
          <FinanceIntro
            text={formatMessage({
              id: 'sp.finance-transaction-periods:intro',
              defaultMessage:
                'Hér er að finna hreyfingar fyrir valin skilyrði. Hreyfingar geta verið gjöld, greiðslur, skuldajöfnuður o.fl.',
            })}
          />

          <FinanceTransactionPeriodsFilter />
        </Box>
      </FinanceTransactionPeriodsProvider>
      <FootNote serviceProviderID={FJARSYSLAN_ID} />
    </DynamicWrapper>
  )
}

export default FinanceTransactionPeriods
