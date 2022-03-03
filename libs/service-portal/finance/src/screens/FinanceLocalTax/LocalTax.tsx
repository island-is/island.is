import React, { FC } from 'react'
import { useQuery } from '@apollo/client'
import { User } from 'oidc-client'

import { Query } from '@island.is/api/schema'
import { SkeletonLoader } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import { GET_TAPS_QUERY } from '@island.is/service-portal/graphql'

import DocumentScreen from '../../components/DocumentScreen/DocumentScreen'

interface Props {
  userInfo: User
}

const LocalTax: FC<Props> = ({ userInfo }) => {
  useNamespaces('sp.local-tax')
  const { formatMessage } = useLocale()
  const { loading: tabLoading } = useQuery<Query>(GET_TAPS_QUERY)

  if (tabLoading) {
    return <SkeletonLoader space={1} height={30} repeat={4} />
  }

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
