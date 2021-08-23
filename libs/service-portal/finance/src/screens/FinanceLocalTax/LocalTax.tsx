import React from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import DocumentScreen from '../../components/DocumentScreen/DocumentScreen'

const LocalTax = () => {
  useNamespaces('sp.local-tax')
  const { formatMessage } = useLocale()
  return (
    <DocumentScreen
      title={formatMessage(m.financeLocalTax)}
      intro={formatMessage({
        id: 'sp.local-tax:intro',
        defaultMessage:
          'Hér er að finna gögn um fjárhagslega stöðu þína við hið opinbera. Hafið samband við viðeigandi stofnun fyrir frekari upplýsingar.',
      })}
      listPath="localTax"
    />
  )
}

export default LocalTax
