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
}
