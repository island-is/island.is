import { MessageDescriptor } from 'react-intl'
import { HmsRentalAgreementPropertyType } from '@island.is/api/schema'
import { contractsMessages as cm } from '../lib/messages'

export const mapPropertyTypeToMessage = (
  type?: HmsRentalAgreementPropertyType | null,
): MessageDescriptor | undefined => {
  switch (type) {
    case HmsRentalAgreementPropertyType.RESIDENTIAL:
      return cm.typeResidential
    case HmsRentalAgreementPropertyType.INDIVIDUAL_ROOM:
      return cm.typeIndividualRoom
    case HmsRentalAgreementPropertyType.NONRESIDENTIAL:
      return cm.typeNonResidential
    default:
      return undefined
  }
}
