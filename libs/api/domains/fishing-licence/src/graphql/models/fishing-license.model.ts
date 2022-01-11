import { Field, ObjectType } from '@nestjs/graphql'
import { FishingLicenceReason } from './fishing-license-reason.model'

@ObjectType()
export class FishingLicence {
  @Field()
  name!: string
  @Field()
  answer!: string //todo should this be named answer
  //todo should this be named answer
  @Field(() => [FishingLicenceReason])
  reasons!: FishingLicenceReason[]
}
