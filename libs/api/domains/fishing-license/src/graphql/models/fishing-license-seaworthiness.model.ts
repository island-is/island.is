import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class FishingLicenseSeaworthiness {
  @Field(() => Date)
  validTo!: Date
}
