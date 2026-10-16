import { registerEnumType } from '@nestjs/graphql'

export enum MileageFeeDifferenceOutcome {
  REFUNDED = 'refunded',
  ADDED_TO_NEXT_INVOICE = 'addedToNextInvoice',
  REVERSED = 'reversed',
}

registerEnumType(MileageFeeDifferenceOutcome, {
  name: 'VehiclesMileageFeeDifferenceOutcome',
})
