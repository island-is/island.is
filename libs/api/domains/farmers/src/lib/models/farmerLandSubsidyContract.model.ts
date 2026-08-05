import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class FarmerLandSubsidyContract {
  @Field()
  id!: string

  @Field()
  name!: string
}
