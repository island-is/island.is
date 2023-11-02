import { ExpandRow } from '@island.is/service-portal/core'
import FinanceTransactionPeriodsTableDetail from './FinanceTransactionPeriodsTableDetail'
import format from 'date-fns/format'
import { dateFormat } from '@island.is/shared/constants'
import { useGetChargeItemSubjectsByYearLazyQuery } from '../../screens/FinanceTransactionPeriods/FinanceTransactionPeriods.generated'
import { cropText } from '../../utils/cropText'
import { useFinanceTransactionPeriodsState } from './FinanceTransactionPeriodsContext'
import { ChargeTypes } from './FinanceTransactionPeriodsTypes'

interface Props {
  record: ChargeTypes[0]
}

const FinanceTransactionPeriodsTableRow = ({ record }: Props) => {
  const { financeTransactionPeriodsState } = useFinanceTransactionPeriodsState()

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
              year: financeTransactionPeriodsState.year ?? '',
            },
          },
        })
      }
      loading={loading}
      error={error}
    >
      {chargeItemSubjects.length ? (
        <FinanceTransactionPeriodsTableDetail
          data={chargeItemSubjects}
          typeId={record.ID}
        />
      ) : null}
    </ExpandRow>
  )
}

export default FinanceTransactionPeriodsTableRow
