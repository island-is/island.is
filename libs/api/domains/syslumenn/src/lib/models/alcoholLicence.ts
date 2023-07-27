import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class AlcoholLicence {
  @Field({ nullable: true })
  licenceType?: string

  @Field({ nullable: true })
  licenceSubType?: string

  @Field({ nullable: true })
  licenseNumber?: string

  @Field({ nullable: true })
  issuedBy?: string

  @Field({ nullable: true })
  year?: number

  @Field({ nullable: true })
  validFrom?: Date

  @Field({ nullable: true })
  validTo?: Date

  @Field({ nullable: true })
  licenseHolder?: string

  @Field({ nullable: true })
  licenseResponsible?: string

  @Field({ nullable: true })
  office?: string

  @Field({ nullable: true })
  location?: string
}
