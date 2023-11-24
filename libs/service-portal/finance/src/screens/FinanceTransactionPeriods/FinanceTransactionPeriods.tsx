import { Box } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  DynamicWrapper,
  FJARSYSLAN_SLUG,
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
            text={formatMessage(
              {
                id: 'sp.finance-transaction-periods:intro',
                defaultMessage: `Hér sérð þú þær hreyfingar sem tilheyra ákveðnu gjaldatímabili innan hvers gjaldflokks. {br}
              Þeir gjaldflokkar sem birtast hér að neðan eru þeir gjaldflokkar sem hafa haft hreyfingu síðustu 12 mánuði. Veldu gjaldflokk með því að smella á hann og síðan þann gjaldgrunn (t.d. VSK-númer eða bílnúmer) og gjaldatímabil sem við á. {br}
              Ef þú vilt sjá annað gjaldatímabil eða gjaldflokka, geturðu valið það með því að opna síuna.`,
              },
              {
                br: (
                  <>
                    <br />
                    <br />
                  </>
                ),
              },
            )}
          />

          <FinanceTransactionPeriodsFilter />
        </Box>
      </FinanceTransactionPeriodsProvider>
      <FootNote serviceProviderSlug={FJARSYSLAN_SLUG} />
    </DynamicWrapper>
  )
}

export default FinanceTransactionPeriods
