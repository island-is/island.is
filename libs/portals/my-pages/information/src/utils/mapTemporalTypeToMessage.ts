import { HmsRentalAgreementTemporalType } from '@island.is/api/schema'
import { MessageDescriptor } from 'react-intl'
import { contractsMessages as m } from '../lib/messages'

export const mapTemporalTypeToMessage = (
  status: HmsRentalAgreementTemporalType,
): MessageDescriptor | undefined => {
  switch (status) {
    case HmsRentalAgreementTemporalType.INDEFINITE:
      return m.indefinite
    case HmsRentalAgreementTemporalType.TEMPORARY:
      return m.temporary
  }
}
