import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class FishingLicenseDateRestriction {
  @Field({ nullable: true })
  dateFrom?: Date
  @Field({ nullable: true })
  dateTo?: Date
}
