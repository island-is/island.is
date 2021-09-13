import { Field, ObjectType } from '@nestjs/graphql'
import { IOperatingLicense } from '../client/models/operatingLicense'

@ObjectType()
export class OperatingLicense {
  @Field({ nullable: true })
  id?: number

  @Field({ nullable: true })
  issuedBy?: string

  @Field({ nullable: true })
  licenseNumber?: string

  @Field({ nullable: true })
  location?: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  street?: string

  @Field({ nullable: true })
  postalCode?: string

  @Field({ nullable: true })
  type?: string

  @Field({ nullable: true })
  validUntil?: string

  @Field({ nullable: true })
  licenseHolder?: string

  @Field({ nullable: true })
  category?: string

  @Field({ nullable: true })
  outdoorLicense?: string

  @Field({ nullable: true })
  alcoholWeekdayLicense?: string

  @Field({ nullable: true })
  alcoholWeekendLicense?: string

  @Field({ nullable: true })
  alcoholWeekdayOutdoorLicense?: string

  @Field({ nullable: true })
  alcoholWeekendOutdoorLicense?: string
}

export const mapOperatingLicense = (
  operatingLicense: IOperatingLicense,
): OperatingLicense => ({
  id: operatingLicense.rowNum,
  issuedBy: operatingLicense.utgefidAf,
  licenseNumber: operatingLicense.leyfisnumer,
  location: operatingLicense.stadur,
  name: operatingLicense.kallast,
  street: operatingLicense.gata,
  postalCode: operatingLicense.postnumer,
  type: operatingLicense.tegund,
  validUntil: operatingLicense.gildirTil,
  licenseHolder: operatingLicense.leyfishafi,
  category: operatingLicense.flokkur,
  outdoorLicense: operatingLicense.leyfi_Til_Utiveitinga,
  alcoholWeekdayLicense: operatingLicense.afgr_Afgengis_Virkirdagar,
  alcoholWeekendLicense: operatingLicense.afgr_Afgengis_Adfaranott_Fridaga,
  alcoholWeekdayOutdoorLicense:
    operatingLicense.afgr_Afgengis_Virkirdagar_Utiveitingar,
  alcoholWeekendOutdoorLicense:
    operatingLicense.afgr_Afgengis_Adfaranott_Fridaga_Utiveitingar,
})
