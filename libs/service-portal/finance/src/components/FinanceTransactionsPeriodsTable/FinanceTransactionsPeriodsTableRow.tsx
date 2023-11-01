import { ExpandRow } from '@island.is/service-portal/core'
import FinanceTransactionsPeriodsTableDetail from './FinanceTransactionsPeriodsTableDetail'
import format from 'date-fns/format'
import { dateFormat } from '@island.is/shared/constants'
import {
  GetChargeTypesDetailsByYearQuery,
  useGetChargeItemSubjectsByYearLazyQuery,
} from '../../screens/FinanceTransactionPeriods/FinanceTransactionPeriods.generated'
import { cropText } from '../../utils/cropText'

interface Props {
  record: GetChargeTypesDetailsByYearQuery['getChargeTypesDetailsByYear']['chargeType'][0]
  year: string
}

const FinanceTransactionsPeriodsTableRow = ({ record, year }: Props) => {
  const [getChargeItemSubjectsByYear, { data, loading, error }] =
    useGetChargeItemSubjectsByYearLazyQuery()

  const chargeItemSubjects =
    data?.getChargeItemSubjectsByYear?.chargeItemSubjects ?? []

  return (
    <ExpandRow
      key={`${record.ID}-${record.chargeItemSubjects}-${record.lastMovementDate}`}
      data={[
        { value: record.name },
        { value: cropText(record.chargeItemSubjects, 24) },
        { value: record.chargeItemSubjectDescription },
        {
          value: format(new Date(record.lastMovementDate), dateFormat.is),
        },
      ]}
      onExpandCallback={() =>
        getChargeItemSubjectsByYear({
          variables: {
            input: {
              nextKey: '',
              typeId: record.ID,
              year,
            },
          },
        })
      }
      loading={loading}
      error={error}
    >
      {chargeItemSubjects.length ? (
        <FinanceTransactionsPeriodsTableDetail data={chargeItemSubjects} />
      ) : null}
    </ExpandRow>
  )
}

export default FinanceTransactionsPeriodsTableRow
