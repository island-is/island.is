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

@InputType('AuthStartDelegationConfirmationAuthenticationInput')
export class StartDelegationConfirmationAuthenticationInput extends DelegationConfirmationInput {
  @Field(() => DelegationConfirmationStepUpMethod, {
    nullable: true,
    description:
      'The grantor asks to use this method instead. "sim" only reaches the number from their own last SIM login.',
  })
  method?: DelegationConfirmationStepUpMethod
}
