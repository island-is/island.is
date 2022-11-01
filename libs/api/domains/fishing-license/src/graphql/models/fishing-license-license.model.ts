import { Field, ObjectType } from '@nestjs/graphql'
import { FishingLicenseInfo } from './fishing-license-info.model'
import { FishingLicenseListColumns } from './fishing-license-list-columns.model'
import { FishingLicenseReason } from './fishing-license-reason.model'

@ObjectType()
export class FishingLicenseLicense {
  @Field()
  fishingLicenseInfo!: FishingLicenseInfo
  @Field()
  answer!: boolean
  @Field(() => [FishingLicenseReason])
  reasons!: FishingLicenseReason[]
  @Field(() => [FishingLicenseListColumns], { nullable: true })
  ListColumns?: FishingLicenseListColumns[]
}
