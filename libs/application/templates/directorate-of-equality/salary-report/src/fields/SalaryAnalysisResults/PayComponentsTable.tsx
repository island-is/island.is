import { Box, Table as T, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { messages } from '../../lib/messages'
import {
  hasNoPayComponents,
  type PayComponentsBreakdown,
} from '../../utils/payComponents'
import { formatSignedPercentMagnitude } from '../../utils/wageGap'
import { formatCurrency } from '../EmployeesEditor/utils'

type Row = {
  label: string
  additional: string
  bonus: string
  total: string
  isOverall?: boolean
  isGap?: boolean
}

const dash = '—'

const cell = (value: number, count: number) =>
  count === 0 ? dash : formatCurrency(value)

const formatSignedPercent = (value: number | null) =>
  value == null ? dash : `${formatSignedPercentMagnitude(value)}%`

type Props = {
  data?: PayComponentsBreakdown | null
}

export const PayComponentsTable = ({ data }: Props) => {
  const { formatMessage } = useLocale()
  const t = messages.salaryAnalysis.components

  if (!data || data.overall.count === 0) return null

  const rows: Row[] = [
    {
      label: formatMessage(t.male) + ` (${data.male.count})`,
      additional: cell(data.male.averageAdditionalSalary, data.male.count),
      bonus: cell(data.male.averageBonusSalary, data.male.count),
      total: cell(data.male.averageTotal, data.male.count),
    },
    {
      label: formatMessage(t.female) + ` (${data.female.count})`,
      additional: cell(data.female.averageAdditionalSalary, data.female.count),
      bonus: cell(data.female.averageBonusSalary, data.female.count),
      total: cell(data.female.averageTotal, data.female.count),
    },
    {
      label: formatMessage(t.overall) + ` (${data.overall.count})`,
      additional: cell(
        data.overall.averageAdditionalSalary,
        data.overall.count,
      ),
      bonus: cell(data.overall.averageBonusSalary, data.overall.count),
      total: cell(data.overall.averageTotal, data.overall.count),
      isOverall: true,
    },
    {
      label: formatMessage(t.gapRow),
      additional: formatSignedPercent(data.additionalWageGapPercent),
      bonus: formatSignedPercent(data.bonusWageGapPercent),
      total: formatSignedPercent(data.totalWageGapPercent),
      isGap: true,
    },
  ]

  return (
    <Box marginBottom={4}>
      <Text variant="h4" marginBottom={1}>
        {formatMessage(t.heading)}
      </Text>
      <Text marginBottom={2}>{formatMessage(t.description)}</Text>
      {hasNoPayComponents(data) ? (
        <Text variant="small" color="dark300">
          {formatMessage(t.empty)}
        </Text>
      ) : (
        <>
          <T.Table>
            <T.Head>
              <T.Row>
                <T.HeadData>{formatMessage(t.genderHeader)}</T.HeadData>
                <T.HeadData>{formatMessage(t.additionalHeader)}</T.HeadData>
                <T.HeadData>{formatMessage(t.bonusHeader)}</T.HeadData>
                <T.HeadData>{formatMessage(t.totalHeader)}</T.HeadData>
              </T.Row>
            </T.Head>
            <T.Body>
              {rows.map((row) => (
                <T.Row key={row.label}>
                  <T.Data>
                    <Text
                      variant="small"
                      fontWeight={
                        row.isGap || row.isOverall ? 'semiBold' : 'regular'
                      }
                    >
                      {row.label}
                    </Text>
                  </T.Data>
                  <T.Data>
                    <Text variant="small">{row.additional}</Text>
                  </T.Data>
                  <T.Data>
                    <Text variant="small">{row.bonus}</Text>
                  </T.Data>
                  <T.Data>
                    <Text variant="small" fontWeight="semiBold">
                      {row.total}
                    </Text>
                  </T.Data>
                </T.Row>
              ))}
            </T.Body>
          </T.Table>
          <Box marginTop={1}>
            <Text variant="small" color="dark300">
              {formatMessage(t.gapHint)}
            </Text>
          </Box>
        </>
      )}
    </Box>
  )
}
