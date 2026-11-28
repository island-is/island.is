import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import {
  AddressDeliveryType,
  CardDeliveryAnswers,
} from '@island.is/application/templates/aosh/machine-license-card-reissue'
import { WorkMachineLicenseOrderApplicationDto } from '@island.is/clients/seminars-ver'

export const getOrderApplicationDto = (
  application: Application,
): WorkMachineLicenseOrderApplicationDto => {
  const { answers } = application
  const cardDelivery = getValueViaPath<CardDeliveryAnswers>(
    answers,
    'cardDelivery',
  )
  const sendToLegalAddress = cardDelivery?.type !== AddressDeliveryType.OTHER

  return {
    applicationId: application.id,
    sendToLegalAddress,
    sendToAddress: sendToLegalAddress
      ? undefined
      : {
          address: cardDelivery?.address?.trim(),
          postalCode: Number(cardDelivery?.postalCode),
          addressedTo: cardDelivery?.recipient?.trim() || undefined,
        },
    phoneNumber: getValueViaPath<string>(answers, 'applicant.phoneNumber'),
    email: getValueViaPath<string>(answers, 'applicant.email'),
  }
}
