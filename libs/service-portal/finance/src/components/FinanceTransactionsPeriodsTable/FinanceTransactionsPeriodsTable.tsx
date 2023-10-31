import { Table as T } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import sortBy from 'lodash/sortBy'
import { ExpandHeader } from '@island.is/service-portal/core'
import { GetChargeTypesDetailsByYearQuery } from '../../screens/FinanceTransactionPeriods/FinanceTransactionPeriods.generated'

import FinanceTransactionsPeriodsTableRow from './FinanceTransactionsPeriodsTableRow'

interface Props {
  records: GetChargeTypesDetailsByYearQuery['getChargeTypesDetailsByYear']['chargeType']
  year: string
}

const FinanceTransactionsPeriodsTable = ({ records, year }: Props) => {
  const { formatMessage } = useLocale()

  return (
    <T.Table>
      <ExpandHeader
        data={[
          { value: '', printHidden: true },
          { value: formatMessage(m.chargeType) },
          { value: formatMessage(m.feeBase) },
          { value: formatMessage(m.feeBaseDescription) },
          { value: formatMessage(m.lastMovement) },
        ]}
      />
      <T.Body>
        {sortBy(records, (item) => {
          return item.lastMovementDate
        })
          .reverse()
          .map((record) => (
            <FinanceTransactionsPeriodsTableRow
              key={record.ID}
              record={record}
              year={year}
            />
          ))}
      </T.Body>
    </T.Table>
  )
}

export default FinanceTransactionsPeriodsTable
