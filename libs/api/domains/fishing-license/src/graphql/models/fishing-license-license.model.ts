import { Field, ObjectType } from '@nestjs/graphql'
import { FishingLicenseInfo } from './fishing-license-info.model'
import { FishingLicenseReason } from './fishing-license-reason.model'

@ObjectType()
export class FishingLicenseLicense {
  @Field()
  fishingLicenseInfo!: FishingLicenseInfo
  @Field()
  answer!: boolean
  @Field(() => [FishingLicenseReason])
  reasons!: FishingLicenseReason[]
}
