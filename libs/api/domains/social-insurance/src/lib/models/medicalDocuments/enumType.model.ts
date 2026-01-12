import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsuranceMedicalDocumentsEnumType')
export class EnumType {
  @Field(() => Int, { nullable: true })
  value?: number

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  display?: string
}
