import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '@island.is/portals/my-pages/core'

import DocumentScreen from '../../components/DocumentScreen/DocumentScreen'

const FinanceBills = () => {
  useNamespaces('sp.finance-bills')
  const { formatMessage } = useLocale()
  return (
    <DocumentScreen
      title={formatMessage(m.financeBills)}
      listPath="billReceipt"
    />
  )
}

export default FinanceBills
