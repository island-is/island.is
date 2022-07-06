import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class FishingLicenseReason {
  @Field()
  description!: string
  @Field()
  directions!: string
}
