import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { amountFormat, InfoCardGrid } from '@island.is/portals/my-pages/core'
import React from 'react'
import { messages } from '../../..'
import {
  RightsPortalCopaymentStatus,
  RightsPortalDrugPeriod,
} from '@island.is/api/schema'
import { HealthPaths } from '../../../lib/paths'

interface Props {
  paymentsData?: RightsPortalCopaymentStatus | null
  paymentsLoading?: boolean
  paymentsError?: boolean
  medicineData?: RightsPortalDrugPeriod | null
  medicineLoading?: boolean
  medicineError?: boolean
}
const PaymentsAndMedicine: React.FC<Props> = ({
  paymentsData,
  paymentsLoading,
  paymentsError,
  medicineData,
  medicineLoading,
  medicineError,
}) => {
  const { formatMessage } = useLocale()

  return (
    <Box>
      <Text variant="eyebrow" color="foregroundBrandSecondary" marginBottom={2}>
        {formatMessage(messages.statusOfRightsAndPayments)}
      </Text>
      <InfoCardGrid
        cards={[
          paymentsError
            ? null
            : {
                title: formatMessage(messages.paymentsAndRights),
                description: formatMessage(
                  messages.paymentsAndRightsDescription,
                ),
                to: HealthPaths.HealthOrganDonation,
                detail: [
                  {
                    label: formatMessage(messages.maximumMonthlyPaymentShort),
                    value: amountFormat(paymentsData?.maximumMonthlyPayment),
                  },
                  {
                    label: formatMessage(messages.paymentTarget),
                    value: amountFormat(paymentsData?.maximumPayment),
                  },
                ],
                loading: paymentsLoading,
              },

          medicineError
            ? null
            : {
                title: formatMessage(messages.medicinePurchase),
                description: formatMessage(
                  messages.medicinePurchaseDescription,
                ),
                to: HealthPaths.HealthOrganDonation,
                detail: [
                  medicineData
                    ? {
                        label:
                          formatMessage(messages.medicineStepStatusShort, {
                            step: medicineData?.levelNumber,
                          }) ?? '',
                        value: medicineData?.levelPercentage + '%',
                      }
                    : null,
                  {
                    label: formatMessage(messages.medicinePaymentStatus),
                    value: amountFormat(medicineData?.paymentStatus),
                  },
                ],
                loading: medicineLoading,
              },
        ]}
        size="small"
      />
    </Box>
  )
}

export default PaymentsAndMedicine
