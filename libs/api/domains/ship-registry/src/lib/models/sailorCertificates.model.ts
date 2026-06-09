import { Field, ObjectType } from '@nestjs/graphql'
import { LocaleEnum } from '@island.is/nest/graphql'
import { ShipRegistrySailorSchoolCertificate } from './sailorSchoolCertificate.model'
import { ShipRegistrySailorRightCertificate } from './sailorRightCertificate.model'
import { ShipRegistrySailorMaritimeBook } from './sailorMaritimeBook.model'
import { ShipRegistrySailorRegistrationExemption } from './sailorRegistrationExemption.model'

@ObjectType()
export class ShipRegistrySailorCertificates {
  @Field(() => [ShipRegistrySailorSchoolCertificate], { nullable: true })
  schoolCertificates?: ShipRegistrySailorSchoolCertificate[]

  @Field(() => [ShipRegistrySailorRightCertificate], { nullable: true })
  rightCertificates?: ShipRegistrySailorRightCertificate[]

  @Field(() => [ShipRegistrySailorMaritimeBook], { nullable: true })
  maritimeBooks?: ShipRegistrySailorMaritimeBook[]

  @Field(() => [ShipRegistrySailorRegistrationExemption], { nullable: true })
  registrationExemptions?: ShipRegistrySailorRegistrationExemption[]
}

export interface ShipRegistrySailorCertificatesBase {
  locale: LocaleEnum
}
