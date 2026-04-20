import { Field, ObjectType } from '@nestjs/graphql'
import { GenericLicenseType } from '../../licenceService.type'
import { HuntingLicenseVerifyExtraData } from '@island.is/clients/license-client'

@ObjectType('LicenseHuntingLicenseData')
export class HuntingLicenseData implements HuntingLicenseVerifyExtraData {
  type!: GenericLicenseType

  @Field()
  nationalId!: string

  @Field()
  name!: string

  @Field(() => String, { nullable: true })
  picture?: string

  constructor({ name, nationalId, type, picture }: HuntingLicenseData) {
    this.name = name
    this.nationalId = nationalId
    this.type = type
    this.picture = picture
  }
}
