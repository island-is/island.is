import { Box, Table as T, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { formatKronur, formatSignedPercent } from '../../../lib/format'
import { messages } from '../../../lib/messages'
import {
  DirectorateOfEqualityPayComponents,
  DirectorateOfEqualityPayComponentsRow,
} from '../../../mocks/types'

type Row = {
  label: string
  additional: string
  bonus: string
  total: string
  isEmphasised?: boolean
}

const headingId = 'directorate-of-equality-pay-components-heading'

export const PayComponentsTable = ({
  data,
}: {
  data: DirectorateOfEqualityPayComponents
}) => {
  const { formatMessage } = useLocale()

  const rowLabel = (label: string, count: number) =>
    formatMessage(messages.rowWithCount, { label, count })
  const valueRow = (
    label: string,
    row: DirectorateOfEqualityPayComponentsRow,
    isEmphasised = false,
  ): Row => ({
    label: rowLabel(label, row.count),
    additional: formatKronur(row.additional),
    bonus: formatKronur(row.bonus),
    total: formatKronur(row.total),
    isEmphasised,
  })

  const rows: Row[] = [
    valueRow(formatMessage(messages.male), data.male),
    valueRow(formatMessage(messages.female), data.female),
    valueRow(formatMessage(messages.all), data.all, true),
    {
      label: formatMessage(messages.payComponentsGapRow),
      additional: formatSignedPercent(data.additionalGapPercent),
      bonus: formatSignedPercent(data.bonusGapPercent),
      total: formatSignedPercent(data.totalGapPercent),
      isEmphasised: true,
    },
  ]

  return (
    <Box>
      <Text variant="h4" as="h3" marginBottom={1} id={headingId}>
        {formatMessage(messages.payComponentsTitle)}
      </Text>
      <Text marginBottom={3}>{formatMessage(messages.payComponentsIntro)}</Text>
      <T.Table aria-labelledby={headingId}>
        <T.Head>
          <T.Row>
            <T.HeadData scope="col">
              {formatMessage(messages.payComponentsGender)}
            </T.HeadData>
            <T.HeadData scope="col">
              {formatMessage(messages.payComponentsAdditional)}
            </T.HeadData>
            <T.HeadData scope="col">
              {formatMessage(messages.payComponentsBonus)}
            </T.HeadData>
            <T.HeadData scope="col">
              {formatMessage(messages.payComponentsTotal)}
            </T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {rows.map((row) => (
            <T.Row key={row.label}>
              <T.Data>
                <Text
                  variant="small"
                  fontWeight={row.isEmphasised ? 'semiBold' : 'regular'}
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
          {formatMessage(messages.payComponentsFootnote)}
        </Text>
      </Box>
    </Box>
  )
}
