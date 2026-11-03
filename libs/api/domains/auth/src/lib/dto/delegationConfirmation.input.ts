import { Field, InputType, registerEnumType } from '@nestjs/graphql'

export enum DelegationConfirmationStepUpMethod {
  app = 'app',
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
