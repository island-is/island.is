import React from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import DocumentScreen from '../../components/DocumentScreen/DocumentScreen'

const FinanceBills = () => {
  useNamespaces('sp.finance-bills')
  const { formatMessage } = useLocale()
  return (
    <DocumentScreen
      title={formatMessage(m.financeBills)}
      intro={formatMessage({
        id: 'sp.finance-bills:intro',
        defaultMessage:
          'Hér er að finna gögn um fjárhagslega stöðu þína við hið opinbera. Hafið samband við viðeigandi stofnun fyrir frekari upplýsingar.',
      })}
      listPath="billReceipt"
    />
  )
}

export default FinanceBills
