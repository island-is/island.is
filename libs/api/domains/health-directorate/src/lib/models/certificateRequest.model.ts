import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class HealthDirectorateCertificateRequest {
  @Field(() => ID)
  id!: string

  @Field({
    description:
      'The conversation created for the certificate request — used to navigate to the thread.',
  })
  conversationId!: string
}
