import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('SocialInsuranceMedicalDocumentsIcdCode')
export class IcdCode {
  @Field({ nullable: true })
  code?: string

  @Field({ nullable: true })
  displayValue?: string

  @Field({ nullable: true })
  category?: string
}
