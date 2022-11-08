import { Field, ObjectType } from '@nestjs/graphql'
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
  @Field(() => [FishingLicenseListOptions], { nullable: true })
  areas?: FishingLicenseListOptions[] | undefined
  @Field({ nullable: true })
  attatchmentInfo?: string
}
