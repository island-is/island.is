import { Field, ObjectType } from '@nestjs/graphql'
import { FishingLicenseDeprivation } from './fishing-license-deprivation.model'
import { FishingLicenseInfo } from './fishing-license-info.model'
import { FishingLicenseSeaworthiness } from './fishing-license-seaworthiness.model'
import { FishingLicenseUnfulfilledLicense } from './fishing-license-unfulfilled-license.model'

@ObjectType()
export class FishingLicenseShip {
  @Field(() => String)
  name!: string
  @Field()
  registrationNumber!: number // skipaskrárnúmer
  @Field(() => String)
  features!: string //einkenni
  @Field()
  grossTons!: number
  @Field()
  length!: number
  @Field(() => String)
  homePort!: string
  @Field(() => FishingLicenseSeaworthiness)
  seaworthiness!: FishingLicenseSeaworthiness
  @Field(() => [FishingLicenseDeprivation])
  deprivations!: FishingLicenseDeprivation[]
  @Field(() => [FishingLicenseInfo])
  fishingLicenses!: FishingLicenseInfo[]
  @Field(() => Boolean)
  doesNotFulfillFishingLicenses!: boolean
  @Field(() => [FishingLicenseUnfulfilledLicense])
  unfulfilledLicenses!: FishingLicenseUnfulfilledLicense[]
}
