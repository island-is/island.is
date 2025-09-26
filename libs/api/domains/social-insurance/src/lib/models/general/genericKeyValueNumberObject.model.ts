import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('SocialInsuranceGeneralGenericKeyValueNumberObject')
export class GenericKeyValueNumberObject {
  @Field(() => Int)
  value!: number

  @Field()
  label!: string

  @Field({ nullable: true })
  needsFurtherInformation?: boolean
}
