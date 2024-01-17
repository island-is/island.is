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
import { exportNutritionFile } from '../../utils/FileBreakdown'
import { Box, Table as T, Text } from '@island.is/island-ui/core'

interface Props {
  data: Array<RightsPortalAidOrNutrition>
}

const Nutrition = ({ data }: Props) => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()

  return (
    <Box>
      <Box marginTop={2}>
        <T.Table>
          <ExpandHeader
            data={[
              { value: '' },
              { value: formatMessage(messages.name) },
              { value: formatMessage(messages.maxAmountPerMonth) },
              {
                value: formatMessage(
                  messages.insuranceRatioOrInitialApplicantPayment,
                ),
              },
              { value: formatMessage(messages.availableRefund) },
              { value: formatMessage(messages.nextAvailableRefund) },
            ]}
          />
          {data.map((rowItem, idx) => (
            <ExpandRow
              key={`nutrition-table-row-${idx}`}
              data={[
                { value: rowItem.name ?? '' },
                { value: rowItem.maxUnitRefund ?? '' },
                {
                  value:
                    rowItem.refund.type === 'amount'
                      ? rowItem.refund.value
                        ? amountFormat(rowItem.refund.value)
                        : ''
                      : rowItem.refund.value
                      ? `${rowItem.refund.value}%`
                      : '',
                },
                { value: rowItem.available ?? '' },
                { value: rowItem.nextAllowedMonth ?? '' },
              ]}
            >
              <NestedTable
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
              />
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
        />
      </Box>
    </Box>
  )
}

export default Nutrition
