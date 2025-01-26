import { EnergyFundVehicleDetailsWithGrant } from '@island.is/api/schema'
import { formatText, getValueViaPath } from '@island.is/application/core'
import {
  Application,
  ExternalData,
  FormText,
  FormatMessage,
} from '@island.is/application/types'
import { MessageDescriptor } from 'react-intl'

const REGISTRATION_TYPE_LENGTH = 2

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
  const inspectBeforeTypes = getValueViaPath<string[]>(
    externalData,
    'typesMustInspectBeforeRegistration.data',
    [],
  )
  return (
    inspectBeforeTypes?.includes(
      regNumber.substring(0, REGISTRATION_TYPE_LENGTH),
    ) || false
  )
}

export const isInvalidRegistrationType = (
  externalData: ExternalData,
  regNumber: string,
) => {
  if (!regNumber || regNumber.length < REGISTRATION_TYPE_LENGTH) {
    return true
  }
  const validTypes = getValueViaPath<string[]>(
    externalData,
    'availableRegistrationTypes.data',
    [],
  )
  const inspectBeforeTypes = getValueViaPath<string[]>(
    externalData,
    'typesMustInspectBeforeRegistration.data',
    [],
  )

  const regType = regNumber.substring(0, REGISTRATION_TYPE_LENGTH)

  return (
    !validTypes?.includes(regType) && !inspectBeforeTypes?.includes(regType)
  )
}
