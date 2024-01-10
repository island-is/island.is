import { amountFormat, ExpandRow } from '@island.is/service-portal/core'

import FinanceStatusDetailTable from '../../components/FinanceStatusDetailTable/FinanceStatusDetailTable'
import {
  FinanceStatusDetailsType,
  FinanceStatusOrganizationChargeType,
  FinanceStatusOrganizationType,
} from '../../screens/FinanceStatus/FinanceStatusData.types'
import { useGetFinanceStatusDetailsLazyQuery } from './FinanceStatusTableRow.generated'

interface Props {
  organization: FinanceStatusOrganizationType
  chargeType: FinanceStatusOrganizationChargeType
  downloadURL: string
}

const FinanceStatusTableRow = ({
  organization,
  chargeType,
  downloadURL,
}: Props) => {
  const [getDetailsQuery, { loading, error, data }] =
    useGetFinanceStatusDetailsLazyQuery()
  const financeStatusDetails: FinanceStatusDetailsType =
    data?.getFinanceStatusDetails || {}

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
          chargeType={chargeType}
          financeStatusDetails={financeStatusDetails}
          downloadURL={downloadURL}
        />
      ) : null}
    </ExpandRow>
  )
}

export default FinanceStatusTableRow
