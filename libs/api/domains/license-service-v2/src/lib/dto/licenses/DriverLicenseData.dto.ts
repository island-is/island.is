import { DrivingLicenseVerifyExtraData } from '@island.is/clients/license-client'
import { Field, ObjectType } from '@nestjs/graphql'
import { GenericLicenseType } from '../../licenceService.type'

@ObjectType('LicenseDriverLicenseData')
export class DriverLicenseData implements DrivingLicenseVerifyExtraData {
  type!: GenericLicenseType

  @Field()
  nationalId!: string

  @Field()
  name!: string

  @Field(() => String, { nullable: true })
  picture?: string

  constructor({ name, nationalId, picture, type }: DriverLicenseData) {
    this.name = name
    this.nationalId = nationalId
    this.picture = picture
    this.type = type
  }
}
