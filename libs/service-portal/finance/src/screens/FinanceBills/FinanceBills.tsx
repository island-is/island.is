import React from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import DocumentScreen from '../../components/DocumentScreen/DocumentScreen'

const FinanceBills = () => {
  useNamespaces('sp.finance-bills')
  const { formatMessage } = useLocale()
  return (
    <DocumentScreen
      title={formatMessage({
        id: 'service.portal:finance-bills',
        defaultMessage: 'Greiðsluseðlar og Greiðslukvittanir',
      })}
      intro={formatMessage({
        id: 'sp.finance-bills:intro',
        defaultMessage:
          'Eitthvað mega hresst og peppað um Greiðsluseðla og Greiðslukvittanir mögulega í tveimur línum.',
      })}
      listPath="billReceipt"
    />
  )
}

export default FinanceBills
