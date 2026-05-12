import { Field, ObjectType } from '@nestjs/graphql'
import { ShipRegistrySailorSchoolCertificate } from './sailorSchoolCertificate.model'
import { ShipRegistrySailorRightCertificate } from './sailorRightCertificate.model'

@ObjectType()
export class ShipRegistrySailorCertificates {
  @Field(() => [ShipRegistrySailorSchoolCertificate])
  schoolCertificates!: ShipRegistrySailorSchoolCertificate[]

  @Field(() => [ShipRegistrySailorRightCertificate])
  rightCertificates!: ShipRegistrySailorRightCertificate[]
}
