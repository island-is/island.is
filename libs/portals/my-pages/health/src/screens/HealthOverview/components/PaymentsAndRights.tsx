import {
  RightsPortalCopaymentStatus,
  RightsPortalDrugPeriod,
  RightsPortalInsuranceOverview,
} from '@island.is/api/schema'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  amountFormat,
  formatDate,
  InfoCardGrid,
  isDateAfterToday,
} from '@island.is/portals/my-pages/core'
import React from 'react'
import { messages } from '../../..'
import { HealthPaths } from '../../../lib/paths'
import { DataState } from '../../../utils/types'

interface Props {
  payments: DataState<RightsPortalCopaymentStatus>
  medicine: DataState<RightsPortalDrugPeriod>
  insurance: DataState<RightsPortalInsuranceOverview>
}
const PaymentsAndRights: React.FC<Props> = ({
  payments,
  medicine,
  insurance,
}) => {
  const { formatMessage } = useLocale()
  const isInsuranceCardValid = isDateAfterToday(
    insurance.data?.ehicCardExpiryDate ?? undefined,
  )
  const isInsured = insurance.data?.isInsured
  const ehicDate = insurance.data?.ehicCardExpiryDate

  return (
    <Box>
      <Text variant="eyebrow" color="foregroundBrandSecondary" marginBottom={2}>
        {formatMessage(messages.statusOfRightsAndPayments)}
      </Text>
      <InfoCardGrid
        cards={[
          payments.error
            ? null
            : {
                title: formatMessage(messages.paymentsAndRights),
                description: formatMessage(
                  messages.paymentsAndRightsDescription,
                ),
                to: HealthPaths.HealthPaymentParticipation,
                detail: [
                  {
                    label: formatMessage(messages.maximumMonthlyPaymentShort),
                    value: amountFormat(payments.data?.maximumMonthlyPayment),
                  },
                  {
                    label: formatMessage(messages.paymentTarget),
                    value: amountFormat(payments.data?.maximumPayment),
                  },
                ],
                loading: payments.loading,
              },

          medicine.error
            ? null
            : {
                title: formatMessage(messages.medicinePurchase),
                description: formatMessage(
                  messages.medicinePurchaseDescription,
                ),
                to: HealthPaths.HealthMedicinePaymentParticipation,
                detail: [
                  medicine.data
                    ? {
                        label:
                          formatMessage(messages.medicineStepStatusShort, {
                            step: medicine.data?.levelNumber,
                          }) ?? '',
                        value: medicine.data?.levelPercentage + '%',
                      }
                    : null,
                  {
                    label: formatMessage(messages.medicinePaymentStatus),
                    value: amountFormat(medicine.data?.paymentStatus),
                  },
                ],
                loading: medicine.loading,
              },
          insurance.error
            ? null
            : {
                title: formatMessage(messages.hasHealthInsurance),
                description: `${formatMessage(
                  messages.from,
                ).toLocaleLowerCase()} ${formatDate(insurance.data?.from)}`,
                to: HealthPaths.HealthPaymentParticipation,

                loading: insurance.loading,
                tags: [
                  {
                    label: isInsured
                      ? formatMessage(messages.valid)
                      : formatMessage(messages.vaccineExpired),
                    variant: isInsured ? 'blue' : 'red',
                    outlined: true,
                  },
                ],
              },
          insurance.error
            ? null
            : {
                title: formatMessage(messages.ehic),
                description: isInsuranceCardValid
                  ? `${formatMessage(messages.medicineValidTo)}: ${formatDate(
                      ehicDate,
                    )}`
                  : ehicDate
                  ? formatMessage(messages.expiredOn, {
                      arg: formatDate(ehicDate),
                    })
                  : formatMessage(messages.vaccineExpired),
                to: HealthPaths.HealthPaymentParticipation,

                tags: [
                  {
                    label: isInsuranceCardValid
                      ? formatMessage(messages.valid)
                      : formatMessage(messages.vaccineExpired),
                    variant: isInsuranceCardValid ? 'blue' : 'red',
                    outlined: true,
                  },
                ],
                loading: insurance.loading,
              },
        ]}
        size="small"
      />
    </Box>
  )
}

export default PaymentsAndRights
