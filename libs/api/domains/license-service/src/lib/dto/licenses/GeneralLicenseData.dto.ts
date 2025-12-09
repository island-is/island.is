import { Field, ObjectType } from '@nestjs/graphql'
import { GenericLicenseType } from '../../licenceService.type'
import { GeneralLicenseVerifyExtraData } from '@island.is/clients/license-client'

@ObjectType('LicenseGeneralLicenseData')
export class GeneralLicenseData implements GeneralLicenseVerifyExtraData {
  type!: GenericLicenseType

  @Field()
  nationalId!: string

  @Field()
  name!: string

  constructor({ name, nationalId, type }: GeneralLicenseData) {
    this.name = name
    this.nationalId = nationalId
    this.type = type
  }
}
