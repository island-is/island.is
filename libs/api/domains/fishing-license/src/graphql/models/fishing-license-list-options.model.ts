import { Field, ObjectType } from '@nestjs/graphql'
import { FishingLicenseDateRestriction } from './fishing-license-data-restriction.model'

@ObjectType()
export class FishingLicenseListOptions {
  @Field()
  key?: string
  @Field()
  description?: string
  @Field()
  disabled?: boolean
  @Field()
  dateRestriction?: FishingLicenseDateRestriction
  @Field()
  invalidOption?: boolean
}
