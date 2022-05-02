import { useQuery } from '@apollo/client'
import React, { FC } from 'react'

import { Query } from '@island.is/api/schema'
import { SkeletonLoader } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import { GET_TAPS_QUERY } from '@island.is/service-portal/graphql'

import DocumentScreen from '../../components/DocumentScreen/DocumentScreen'

const EmployeeClaims: FC = () => {
  useNamespaces('sp.employee-claims')
  const { formatMessage } = useLocale()
  const { loading: tabLoading } = useQuery<Query>(GET_TAPS_QUERY)

  if (tabLoading) {
    return <SkeletonLoader space={1} height={30} repeat={4} />
  }
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
    />
  )
}

export default EmployeeClaims
