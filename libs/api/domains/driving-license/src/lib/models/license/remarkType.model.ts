import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class DrivingLicenseRemarkType {
  @Field(() => ID)
  id!: string

  @Field()
  remark!: boolean

  @Field()
  name!: string

  @Field()
  for!: string

  @Field()
  description!: string
}
