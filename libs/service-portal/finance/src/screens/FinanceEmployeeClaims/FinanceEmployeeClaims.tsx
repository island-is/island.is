import React from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import DocumentScreen from '../../components/DocumentScreen/DocumentScreen'

const EmployeeClaims = () => {
  useNamespaces('sp.employee-claims')
  const { formatMessage } = useLocale()
  return (
    <DocumentScreen
      title={formatMessage(m.financeEmployeeClaims)}
      intro={formatMessage({
        id: 'sp.employee-claims:intro',
        defaultMessage:
          'Hér er að finna gögn um fjárhagslega stöðu þína við hið opinbera. Hafið samband við viðeigandi stofnun fyrir frekari upplýsingar.',
      })}
      listPath="employeeClaims"
    />
  )
}

export default EmployeeClaims
