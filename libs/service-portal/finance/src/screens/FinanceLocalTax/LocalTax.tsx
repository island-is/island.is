import React, { FC } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import DocumentScreen from '../../components/DocumentScreen/DocumentScreen'
import { User } from 'oidc-client'

interface Props {
  userInfo: User
}

const LocalTax: FC<Props> = ({ userInfo }) => {
  useNamespaces('sp.local-tax')
  const { formatMessage } = useLocale()
  return (
    <DocumentScreen
      title={formatMessage(m.financeLocalTax)}
      intro={formatMessage({
        id: 'sp.local-tax:intro',
        defaultMessage: 'Sýnir þá staðgreiðslu sem skilað er til sveitafélaga.',
      })}
      listPath="localTax"
      defaultDateRangeMonths={12}
      userInfo={userInfo}
    />
  )
}

export default LocalTax
