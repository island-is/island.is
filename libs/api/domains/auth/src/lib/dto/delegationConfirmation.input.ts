import { Field, InputType, registerEnumType } from '@nestjs/graphql'

export enum DelegationConfirmationStepUpMethod {
  /** A push to the Auðkenni app. */
  app = 'app',
  /** An SMS to a SIM card. */
  sim = 'sim',
}

registerEnumType(DelegationConfirmationStepUpMethod, {
  name: 'AuthDelegationConfirmationStepUpMethod',
})

@InputType('AuthDelegationConfirmationInput')
export class DelegationConfirmationInput {
  @Field(() => String)
  confirmationId!: string
}
