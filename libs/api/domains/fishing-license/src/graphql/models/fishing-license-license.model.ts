import { Field, ObjectType } from '@nestjs/graphql'
import { FishingLicenseDateRestriction } from './fishing-license-data-restriction.model'
import { FishingLicenseInfo } from './fishing-license-info.model'
import { FishingLicenseListOptions } from './fishing-license-list-options.model'
import { FishingLicenseReason } from './fishing-license-reason.model'

@ObjectType()
export class FishingLicenseLicense {
  @Field()
  fishingLicenseInfo!: FishingLicenseInfo
  @Field()
  answer!: boolean
  @Field(() => [FishingLicenseReason])
  reasons!: FishingLicenseReason[]
  @Field({ nullable: true })
  dateRestriction?: FishingLicenseDateRestriction
  @Field(() => [FishingLicenseListOptions], { nullable: true })
  areas?: FishingLicenseListOptions[] | undefined
  @Field({ nullable: true })
  attachmentInfo?: string
  @Field({ nullable: true })
  needsOwnershipRegistration?: boolean
}
