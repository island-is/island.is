import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CertificateInfoInput {
  @Field()
  nationalId!: string
}
