import { Field, ObjectType } from '@nestjs/graphql'
import { FishingLicenseInfo } from './fishing-license-info.model'
import { FishingLicenseReason } from './fishing-license-reason.model'

@ObjectType()
export class FishingLicense {
  @Field()
  fishingLicenseInfo!: FishingLicenseInfo
  @Field()
  answer!: string //todo should this be named answer
  //todo should this be named answer
  @Field(() => [FishingLicenseReason])
  reasons!: FishingLicenseReason[]
}
