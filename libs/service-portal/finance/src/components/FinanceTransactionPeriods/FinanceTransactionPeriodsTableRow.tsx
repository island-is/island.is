import { ExpandRow } from '@island.is/service-portal/core'
import FinanceTransactionPeriodsTableDetail from './FinanceTransactionPeriodsTableDetail'
import format from 'date-fns/format'
import { dateFormat } from '@island.is/shared/constants'
import { useGetChargeItemSubjectsByYearLazyQuery } from '../../screens/FinanceTransactionPeriods/FinanceTransactionPeriods.generated'
import { cropText } from '../../utils/cropText'
import { useFinanceTransactionPeriodsState } from './FinanceTransactionPeriodsContext'
import { ChargeTypes } from './FinanceTransactionPeriodsTypes'
import { Box } from '@island.is/island-ui/core'

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
      key={`${record.iD}-${record.chargeItemSubjects}-${record.lastMovementDate}`}
      data={[
        { value: record.name },
        {
          value: (
            <Box title={record.chargeItemSubjects}>
              {cropText(record.chargeItemSubjects, 24)}
            </Box>
          ),
        },
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
              typeId: record.iD,
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
          typeId={record.iD}
        />
      ) : null}
    </ExpandRow>
  )
}

export default FinanceTransactionPeriodsTableRow
