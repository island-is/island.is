import {
  Box,
  SkeletonLoader,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { ellipsis } from '@island.is/portals/my-pages/core'
import { unemploymentBenefitsMessages as um } from '../../../lib/messages/unemployment'

export interface ReportedIncomeRow {
  id: string
  type: string
  payer: string
  date: string
  dateTo: string
  amount: string
  // Raw ISO string used for sorting; not rendered.
  sortDate?: string | null
}

interface Props {
  rows?: ReportedIncomeRow[]
  loading?: boolean
}

const SKELETON_ROW_COUNT = 3
const PAYER_MAX_LENGTH = 30

export const ReportedIncomeTable = ({ rows, loading }: Props) => {
  const { formatMessage } = useLocale()

  const headers = [
    formatMessage(um.reportedIncomeTypeHeader),
    formatMessage(um.reportedIncomePayerHeader),
    formatMessage(um.reportedIncomeDateHeader),
    formatMessage(um.reportedIncomeDateToHeader),
    formatMessage(um.reportedIncomeAmountHeader),
  ]

  return (
    <Box paddingTop={4}>
      <T.Table>
        <T.Head>
          <T.Row>
            {headers.map((header) => (
              <T.HeadData key={header}>
                <Text variant="medium" fontWeight="semiBold" as="span">
                  {header}
                </Text>
              </T.HeadData>
            ))}
          </T.Row>
        </T.Head>
        <T.Body>
          {loading
            ? Array.from({ length: SKELETON_ROW_COUNT }).map((_, rowIndex) => (
                <T.Row key={`skeleton-${rowIndex}`}>
                  {headers.map((_header, cellIndex) => (
                    <T.Data key={cellIndex}>
                      <SkeletonLoader height={20} />
                    </T.Data>
                  ))}
                </T.Row>
              ))
            : rows?.map((row) => (
                <T.Row key={row.id}>
                  <T.Data>
                    <Text variant="medium" as="span">
                      {row.type}
                    </Text>
                  </T.Data>
                  <T.Data title={row.payer}>
                    <Text variant="medium" as="span">
                      {ellipsis(row.payer, PAYER_MAX_LENGTH)}
                    </Text>
                  </T.Data>
                  <T.Data>
                    <Text variant="medium" as="span">
                      {row.date}
                    </Text>
                  </T.Data>
                  <T.Data>
                    <Text variant="medium" as="span">
                      {row.dateTo}
                    </Text>
                  </T.Data>
                  <T.Data>
                    <Text variant="medium" as="span">
                      {row.amount}
                    </Text>
                  </T.Data>
                </T.Row>
              ))}
        </T.Body>
      </T.Table>
    </Box>
  )
}
