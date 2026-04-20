import { Field, ObjectType } from '@nestjs/graphql'
import { GenericLicenseType } from '../../licenceService.type'
import { FirearmLicenseVerifyExtraData } from '@island.is/clients/license-client'

@ObjectType('LicenseFirearmLicenseData')
export class FirearmLicenseData implements FirearmLicenseVerifyExtraData {
  type!: GenericLicenseType

  @Field()
  nationalId!: string

  @Field()
  name!: string

  @Field(() => String, { nullable: true })
  picture?: string

  constructor({ name, nationalId, picture, type }: FirearmLicenseData) {
    this.name = name
    this.nationalId = nationalId
    this.type = type
    this.picture = picture
  }
}
