import { Field, ObjectType } from '@nestjs/graphql'
import { FishingLicenseReason } from './fishing-license-reason.model'

@ObjectType()
export class FishingLicense {
  @Field()
  name!: string
  @Field()
  answer!: string //todo should this be named answer
  //todo should this be named answer
  @Field(() => [FishingLicenseReason])
  reasons!: FishingLicenseReason[]
}
