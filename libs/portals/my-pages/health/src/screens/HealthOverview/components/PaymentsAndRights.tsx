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

  const currentPath = HealthPaths.HealthOverview

  return (
    <Box>
      <Text variant="eyebrow" color="foregroundBrandSecondary" marginBottom={2}>
        {formatMessage(messages.statusOfRightsAndPayments)}
      </Text>
      <InfoCardGrid
        cards={[
          {
            title: formatMessage(messages.paymentsAndRights),
            description: formatMessage(messages.paymentsAndRightsDescription),
            to: payments.error
              ? currentPath
              : HealthPaths.HealthPaymentParticipation,
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
            error: payments.error,
          },

          {
            title: formatMessage(messages.medicinePurchase),
            description: formatMessage(messages.medicinePurchaseDescription),
            to: medicine.error
              ? currentPath
              : HealthPaths.HealthMedicinePaymentParticipation,
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
            error: medicine.error,
          },
          {
            title: formatMessage(messages.hasHealthInsurance),
            description: `${formatMessage(
              messages.from,
            ).toLocaleLowerCase()} ${formatDate(insurance.data?.from)}`,
            to: insurance.error ? currentPath : HealthPaths.HealthPaymentRights,

            loading: insurance.loading,
            error: insurance.error,
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
          {
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
            to: insurance.error ? currentPath : HealthPaths.HealthPaymentRights,

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
            error: insurance.error,
          },
        ]}
        size="small"
      />
    </Box>
  )
}

export default PaymentsAndRights
