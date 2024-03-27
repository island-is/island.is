import { InlineResponse2001BodyDataLatest } from '@island.is/clients/ultraviolet-radiation'

export const isValidMeasurement = (
  item: InlineResponse2001BodyDataLatest,
): item is Required<InlineResponse2001BodyDataLatest> => {
  return typeof item?.time === 'string' && typeof item?.uvVal === 'number'
}
