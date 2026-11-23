import { registerEnumType } from '@nestjs/graphql'

export enum MileageFeeDifferenceOutcome {
  REFUNDED = 'refunded',
  BILLED = 'billed',
  REVERSED = 'reversed',
}

registerEnumType(MileageFeeDifferenceOutcome, {
  name: 'VehiclesMileageFeeDifferenceOutcome',
})
