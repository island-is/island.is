import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('PaymentsCreateBankTransferResponse')
export class CreateBankTransferResponse {
  @Field(() => String, {
    description: 'The provider-side payment id (e.g. Blikk).',
  })
  providerPaymentId!: string

  @Field(() => String, {
    nullable: true,
    description:
      'Where the frontend should redirect the user for Strong Customer Authentication. Empty means back-channel SCA — no redirect.',
  })
  scaRedirectUrl?: string

  @Field(() => Date, {
    description:
      'When this attempt expires (the TTL we shared with Blikk). The FE polling loop derives its hard timeout from this.',
  })
  expiresAt!: Date

  @Field(() => Boolean, {
    nullable: true,
    description:
      'True when the payer must complete onboarding before SCA can proceed. Redirect to scaRedirectUrl in this case only.',
  })
  onboardingRequired?: boolean
}
