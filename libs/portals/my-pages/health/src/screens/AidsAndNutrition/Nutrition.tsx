import { RightsPortalAidOrNutrition } from '@island.is/api/schema'
import { Box, Text } from '@island.is/island-ui/core'
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
import { exportNutritionFile } from '../../utils/FileBreakdown'
import NestedInfoLines from '../MedicinePrescriptions/components/NestedInfoLines/NestedInfoLines'

interface Props {
  data: Array<RightsPortalAidOrNutrition>
}

const Nutrition = ({ data }: Props) => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()

  return (
    <Box>
      <Box marginTop={2}>
        <SortableTable
          expandable
          labels={{
            name: formatMessage(messages.name),
            maxAmountPerMonth: formatMessage(messages.maxAmountPerMonth),
            insuranceRatioOrInitialApplicantPayment: formatMessage(
              messages.insuranceRatioOrInitialApplicantPayment,
            ),
            availableRefund: formatMessage(messages.availableRefund),
            nextAvailableRefund: formatMessage(messages.nextAvailableRefund),
          }}
          defaultSortByKey="name"
          mobileTitleKey="name"
          items={data.map((rowItem, idx) => ({
            id: rowItem.id ?? idx,
            name: rowItem.name ?? '',
            maxAmountPerMonth: rowItem.maxMonthlyAmount
              ? amountFormat(rowItem.maxMonthlyAmount)
              : '',
            insuranceRatioOrInitialApplicantPayment:
              rowItem.refund.type === 'amount'
                ? rowItem.refund.value
                  ? amountFormat(rowItem.refund.value)
                  : ''
                : rowItem.refund.value
                ? `${rowItem.refund.value}%`
                : '',
            availableRefund: rowItem.available ?? '',
            nextAvailableRefund: rowItem.nextAllowedMonth ?? '',
            children: (
              <NestedInfoLines
                data={[
                  {
                    title: formatMessage(messages.availableTo),
                    value: rowItem.validUntil
                      ? formatDate(rowItem.validUntil)
                      : '',
                  },
                  {
                    title: formatMessage(messages.extraDetail),
                    value: rowItem.explanation ?? '',
                  },
                ]}
                width="full"
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
              onClick: () => exportNutritionFile(data ?? [], 'xlsx'),
            },
          ]}
        />
      </Box>
      <Box paddingTop={4}>
        <Text variant="small" paddingBottom={2}>
          {formatMessage(messages['nutritionDisclaimer'])}
        </Text>
        <LinkButton
          to={formatMessage(messages['nutritionDescriptionLink'])}
          text={formatMessage(messages.nutritionDescriptionInfo)}
          variant="text"
        />
      </Box>
    </Box>
  )
}

export default Nutrition
