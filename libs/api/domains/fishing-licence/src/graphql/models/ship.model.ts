import { Field, ObjectType } from '@nestjs/graphql'
import { Deprivation } from './deprivation.model'
import { FishingLicenseInfo } from './fishing-license-info.model'
import { Seaworthiness } from './seaworthiness.model'

@ObjectType()
export class Ship {
  // somthing
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
  @Field(() => Seaworthiness)
  seaworthiness!: Seaworthiness
  @Field(() => [Deprivation])
  deprivations!: Deprivation[]
  @Field(() => [FishingLicenseInfo])
  fishingLicences!: FishingLicenseInfo[]
}
