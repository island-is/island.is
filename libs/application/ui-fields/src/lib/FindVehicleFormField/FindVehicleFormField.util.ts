import { EnergyFundVehicleDetailsWithGrant } from '@island.is/api/schema'
import { formatText, getValueViaPath } from '@island.is/application/core'
import {
  Application,
  ExternalData,
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
              energyFundsMessages.carNotEligable as MessageDescriptor,
              energyFundsMessages.carNotEligible as Record<string, FormText>,
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

export const mustInspectBeforeStreetRegistration = (
  externalData: ExternalData,
  regNumber: string,
) => {
  const inspectBeforeTypes = getValueViaPath(
    externalData,
    'typesMustInspectBeforeRegistration.data',
    [],
  ) as string[]
  return inspectBeforeTypes?.includes(regNumber.substring(0, 2)) || false
}
