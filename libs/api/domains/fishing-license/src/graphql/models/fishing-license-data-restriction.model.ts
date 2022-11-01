import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class FishingLicenseDateRestriction {
  @Field()
  dateFrom?: Date
  @Field()
  dateTo?: Date
}
