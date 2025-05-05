import { RightsPortalAidOrNutrition } from '@island.is/api/schema'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  DownloadFileButtons,
  LinkButton,
  SortableTable,
  amountFormat,
  formatDate,
  m,
} from '@island.is/portals/my-pages/core'
import { messages } from '../../lib/messages'
import { exportAidTable } from '../../utils/FileBreakdown'
import NestedInfoLines from '../MedicinePrescriptions/components/NestedInfoLines/NestedInfoLines'
import { Box, Text, Tooltip, Icon } from '@island.is/island-ui/core'

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
        <SortableTable
          expandable
          labels={{
            aidsName: formatMessage(messages.name),
            maxUnitRefund: formatMessage(messages.maxUnitRefund),
            insuranceRatio: formatMessage(messages.insuranceRatio),
            availableRefund: formatMessage(messages.availableRefund),
            nextAvailableRefund: formatMessage(messages.nextAvailableRefund),
            lastNode: formatMessage(messages.renew),
          }}
          defaultSortByKey="aidsName"
          mobileTitleKey="aidsName"
          items={data.map((rowItem, idx) => ({
            id: rowItem.id ?? idx,
            aidsName: rowItem.name ? rowItem.name.split('/').join(' / ') : '',
            maxUnitRefund: rowItem.maxUnitRefund ?? '',
            insuranceRatio: rowItem.refund
              ? rowItem.refund.type === 'amount'
                ? amountFormat(rowItem.refund.value)
                : `${rowItem.refund.value}%`
              : '',
            availableRefund: rowItem.available ?? '',
            nextAvailableRefund: rowItem.nextAllowedMonth ?? '',
            lastNode: rowItem.expiring
              ? {
                  type: 'info',
                  label: formatMessage(messages.timeRemainingOfRefund),
                  icon: { icon: 'time', type: 'outline' },
                }
              : undefined,
            children: (
              <NestedInfoLines
                data={generateFoldedValues(rowItem)}
                width="full"
                backgroundColor="blue"
              />
            ),
          }))}
        />

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
          variant="text"
        />
      </Box>
    </Box>
  )
}

export default Aids
