import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsuranceGeneralGenericKeyValueStringObject')
export class GenericKeyValueStringObject {
  @Field()
  value!: string

  @Field()
  label!: string

  @Field({ nullable: true })
  needsFurtherInformation?: boolean
}
