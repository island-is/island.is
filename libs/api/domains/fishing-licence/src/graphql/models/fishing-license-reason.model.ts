import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class FishingLicenceReason {
  @Field()
  description!: string
  @Field()
  directions!: string
}
