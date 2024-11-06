import { MessageDescriptor } from 'react-intl'
import { m } from '../../lib/messages'

export const errorCodeMessageMap: Record<number, MessageDescriptor> = {
  3: m.missingPermno,
  4: m.dateMissing,
  5: m.originMissing,
  6: m.mileageMissing,
  7: m.mileageTooLow,
  8: m.mileageLowerThanBefore,
  9: m.originNotFound,
  10: m.carNotFound,
  11: m.dateTooEarly,
  12: m.invalidUpdate,
  13: m.registerTooEarly,
  14: m.forbiddenUpdate,
  15: m.unauthorizedUpdater,
  16: m.invalidMileage,
  17: m.invalidDelete,
  18: m.notFoundDelete,
  19: m.unnecessaryRegistration,
  20: m.tooHighMileage,
}
