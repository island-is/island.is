import { RightsPortalAidOrNutrition } from '@island.is/api/schema'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  DownloadFileButtons,
  ExpandHeader,
  ExpandRow,
  LinkButton,
  NestedTable,
  amountFormat,
  formatDate,
  m,
} from '@island.is/service-portal/core'
import { messages } from '../../lib/messages'
import { exportAidTable } from '../../utils/FileBreakdown'
import { Box, Icon, Table as T, Tooltip, Text } from '@island.is/island-ui/core'

interface Props {
  data: Array<RightsPortalAidOrNutrition>
}

const Aids = ({ data }: Props) => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()

  const generateFoldedValues = (rowItem: RightsPortalAidOrNutrition) => {
    const foldedValues = []

    foldedValues.push({
      title: formatMessage(messages.location),
      value: rowItem.location ? rowItem.location : '',
    })

    foldedValues.push({
      title: formatMessage(messages.availableTo),
      value: rowItem.validUntil ? formatDate(rowItem.validUntil) : '',
    })

    foldedValues.push({
      title: formatMessage(messages.availableEvery12Months),
      value: rowItem.allowed12MonthPeriod ? rowItem.allowed12MonthPeriod : '',
    })

    foldedValues.push({
      title: formatMessage(messages.extraDetail),
      value: rowItem.explanation ? rowItem.explanation : '',
    })

    return foldedValues
  }

  const expiringIcon = (
    <Tooltip
      text={formatMessage(messages.timeRemainingOfRefund)}
      placement="top"
    >
      <Box>
        <Icon icon="time" type="outline" color="blue400" size="large" />
      </Box>
    </Tooltip>
  )

  return (
    <Box>
      <Box marginTop={2}>
        <T.Table>
          <ExpandHeader
            data={[
              { value: '' },
              { value: formatMessage(messages.name) },
              { value: formatMessage(messages.maxUnitRefund) },
              { value: formatMessage(messages.insuranceRatio) },
              { value: formatMessage(messages.availableRefund) },
              { value: formatMessage(messages.nextAvailableRefund) },
              { value: '' },
            ]}
          />
          {data.map((rowItem, idx) => (
            <ExpandRow
              key={`aids-table-row-${idx}`}
              data={[
                {
                  value: rowItem.name.split('/').join(' / '),
                },
                {
                  value: rowItem.maxUnitRefund ?? '',
                },
                {
                  value:
                    rowItem.refund.type === 'amount'
                      ? amountFormat(rowItem.refund.value)
                      : `${rowItem.refund.value}%`,
                },
                {
                  value: rowItem.available ?? '',
                },
                {
                  value: rowItem.nextAllowedMonth ?? '',
                },
                {
                  value: rowItem.expiring ? expiringIcon : '',
                },
              ]}
            >
              <NestedTable data={generateFoldedValues(rowItem)} />
            </ExpandRow>
          ))}
        </T.Table>
        <DownloadFileButtons
          BoxProps={{
            paddingTop: 2,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flexEnd',
          }}
          buttons={[
            {
              text: formatMessage(m.getAsExcel),
              onClick: () => exportAidTable(data ?? [], 'xlsx'),
            },
          ]}
        />
      </Box>
      <Box paddingTop={4}>
        <Text variant="small" paddingBottom={2}>
          {formatMessage(messages['aidsDisclaimer'])}
        </Text>
        <LinkButton
          to={formatMessage(messages['aidsDescriptionLink'])}
          text={formatMessage(messages.aidsDescriptionInfo)}
        />
      </Box>
    </Box>
  )
}

export default Aids
