import { Field, ObjectType } from '@nestjs/graphql'
import { ShipRegistrySailorSchoolCertificate } from './sailorSchoolCertificate.model'
import { ShipRegistrySailorRightCertificate } from './sailorRightCertificate.model'
import { ShipRegistrySailorMaritimeBook } from './sailorMaritimeBook.model'
import { ShipRegistrySailorRegistrationExemption } from './sailorRegistrationExemption.model'

@ObjectType()
export class ShipRegistrySailorCertificates {
  @Field(() => [ShipRegistrySailorSchoolCertificate])
  schoolCertificates!: ShipRegistrySailorSchoolCertificate[]

  @Field(() => [ShipRegistrySailorRightCertificate])
  rightCertificates!: ShipRegistrySailorRightCertificate[]

  @Field(() => [ShipRegistrySailorMaritimeBook])
  maritimeBooks!: ShipRegistrySailorMaritimeBook[]

  @Field(() => [ShipRegistrySailorRegistrationExemption])
  registrationExemptions!: ShipRegistrySailorRegistrationExemption[]
}
