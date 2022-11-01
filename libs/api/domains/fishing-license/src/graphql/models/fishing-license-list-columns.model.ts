import { FishingLicenseListOptions } from './fishing-license-list-options.model'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class FishingLicenseListColumns {
  @Field()
  listOptions?: FishingLicenseListOptions
}
