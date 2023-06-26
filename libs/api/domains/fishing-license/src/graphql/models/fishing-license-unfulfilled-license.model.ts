import { Field, ObjectType } from '@nestjs/graphql'
import { FishingLicenseInfo } from './fishing-license-info.model'
import { FishingLicenseReason } from './fishing-license-reason.model'

@ObjectType()
export class FishingLicenseUnfulfilledLicense {
  @Field(() => FishingLicenseInfo)
  fishingLicense!: FishingLicenseInfo
  @Field(() => [FishingLicenseReason])
  reasons!: FishingLicenseReason[]
}
