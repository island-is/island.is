import {
  AddressDeliveryType,
  StreetRegistrationAnswers,
} from '@island.is/application/templates/aosh/street-registration'
import { ExternalData, UserProfile } from '@island.is/application/types'
import { PlateSize } from '@island.is/clients/work-machines'

export const cleanPhoneNumber = (phoneNumber: string) => {
  return phoneNumber.replace(/[-+]/g, '')
}

export const mapPlateSize = (value: string): PlateSize | undefined => {
  switch (value) {
    case 'A':
      return PlateSize.A
    case 'B':
      return PlateSize.B
    case 'D':
      return PlateSize.D
    default:
      return undefined
  }
}

export type CurrentAddress = {
  streetAddress?: string
  postalCode?: number
  city?: string
}

export const exrtactUserInfo = (
  answers: StreetRegistrationAnswers,
  externalData: ExternalData,
) => {
  const currentAddress = externalData.identity.data as {
    address: CurrentAddress
    name: string
  }
  const userProfile = externalData?.userProfile?.data as UserProfile
  switch (answers.plateDelivery.type) {
    case AddressDeliveryType.CURRENT:
      return {
        city: currentAddress.address.city,
        postalCode: Number(currentAddress.address.postalCode),
        address: currentAddress.address.streetAddress,
        contactPhoneNumber: cleanPhoneNumber(
          userProfile.mobilePhoneNumber || '',
        ),
        recipient: currentAddress.name,
      }
    case AddressDeliveryType.OTHER:
      return {
        city: answers.plateDelivery.city,
        postalCode: Number(answers.plateDelivery?.postalCode),
        address: answers.plateDelivery.address,
        contactPhoneNumber: cleanPhoneNumber(
          userProfile.mobilePhoneNumber || '',
        ),
        recipient: answers.plateDelivery.recipient,
      }
  }
}
