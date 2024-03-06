import { EnergyFundVehicleDetailsWithGrant } from '@island.is/api/schema'
import { formatText } from '@island.is/application/core'
import {
  Application,
  FormText,
  FormatMessage,
} from '@island.is/application/types'
import { MessageDescriptor } from 'react-intl'

export const energyFundsLabel = function (
  energyDetails: EnergyFundVehicleDetailsWithGrant | null,
  energyFundsMessages: Record<string, FormText> | undefined,
  formatMessage: FormatMessage,
  formatCurrency: (value: string) => string,
  application: Application,
): string {
  if (!energyDetails || !energyFundsMessages) {
    return ''
  }

  if (!energyDetails.hasReceivedSubsidy) {
    return formatMessage(
      energyFundsMessages.checkboxCheckableTag as MessageDescriptor,
      {
        amount: energyDetails.vehicleGrant
          ? `${formatCurrency(energyDetails.vehicleGrant.toString())}`
          : formatMessage(
              energyFundsMessages.carNotEligible as MessageDescriptor,
            ),
      },
    )
  } else {
    return formatText(
      energyFundsMessages.checkboxNotCheckable,
      application,
      formatMessage,
    )
  }
}
