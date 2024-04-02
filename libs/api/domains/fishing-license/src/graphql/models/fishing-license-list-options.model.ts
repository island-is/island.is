import { Field, ObjectType } from '@nestjs/graphql'
import { FishingLicenseDateRestriction } from './fishing-license-data-restriction.model'

@ObjectType()
export class FishingLicenseListOptions {
  @Field({ nullable: true })
  key?: string
  @Field({ nullable: true })
  description?: string
  @Field()
  disabled?: boolean
  @Field({ nullable: true })
  dateRestriction?: FishingLicenseDateRestriction
  @Field()
  invalidOption?: boolean
}
