import React, { FC } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import DocumentScreen from '../../components/DocumentScreen/DocumentScreen'
import { User } from 'oidc-client'

interface Props {
  userInfo: User
}

const EmployeeClaims: FC<Props> = ({ userInfo }) => {
  useNamespaces('sp.employee-claims')
  const { formatMessage } = useLocale()
  return (
    <DocumentScreen
      title={formatMessage(m.financeEmployeeClaims)}
      intro={formatMessage({
        id: 'sp.employee-claims:intro',
        defaultMessage:
          'Hér er að finna opinber gjöld utan staðgreiðslu sem dregin eru af starfsmönnum.',
      })}
      listPath="employeeClaims"
      defaultDateRangeMonths={12}
      userInfo={userInfo}
    />
  )
}

export default EmployeeClaims
