import { FishingLicenseCodeType } from '@island.is/clients/fishing-license'
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'

registerEnumType(FishingLicenseCodeType, {
  name: 'FishingLicenseCodeType',
  description: 'Possible types of fishing license codes',
})

@ObjectType()
export class FishingLicenseInfo {
  @Field(() => FishingLicenseCodeType)
  code!: FishingLicenseCodeType
  @Field()
  name!: string
  @Field()
  chargeType!: string
}
