import { gql, useLazyQuery } from '@apollo/client'
import React, { FC } from 'react'

import { amountFormat, ExpandRow } from '@island.is/service-portal/core'

import FinanceStatusDetailTable from '../../components/FinanceStatusDetailTable/FinanceStatusDetailTable'
import {
  FinanceStatusDetailsType,
  FinanceStatusOrganizationChargeType,
  FinanceStatusOrganizationType,
} from '../../screens/FinanceStatus/FinanceStatusData.types'

const GetFinanceStatusDetailsQuery = gql`
  query GetFinanceStatusDetailsQuery($input: GetFinancialOverviewInput!) {
    getFinanceStatusDetails(input: $input)
  }
`

interface Props {
  organization: FinanceStatusOrganizationType
  chargeType: FinanceStatusOrganizationChargeType
  downloadURL: string
}

const FinanceStatusTableRow: FC<React.PropsWithChildren<Props>> = ({
  organization,
  chargeType,
  downloadURL,
}) => {
  const [getDetailsQuery, { loading, error, ...detailsQuery }] = useLazyQuery(
    GetFinanceStatusDetailsQuery,
  )
  const financeStatusDetails: FinanceStatusDetailsType =
    detailsQuery.data?.getFinanceStatusDetails || {}

  return (
    <ExpandRow
      key={chargeType.id}
      onExpandCallback={() =>
        getDetailsQuery({
          variables: {
            input: {
              orgID: organization.id,
              chargeTypeID: chargeType.id,
            },
          },
        })
      }
      data={[
        { value: chargeType.name },
        { value: organization.name },
        { value: amountFormat(chargeType.totals), align: 'right' },
      ]}
      loading={loading}
      error={error}
    >
      {financeStatusDetails?.chargeItemSubjects?.length > 0 ? (
        <FinanceStatusDetailTable
          organization={organization}
          financeStatusDetails={financeStatusDetails}
          downloadURL={downloadURL}
        />
      ) : null}
    </ExpandRow>
  )
}

export default FinanceStatusTableRow
