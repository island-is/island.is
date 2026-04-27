import { Field, InterfaceType } from '@nestjs/graphql'

@InterfaceType()
export abstract class IcelandicMedicinesAgencyPharmacyContact {
  @Field()
  name!: string

  @Field({ nullable: true })
  address?: string

  @Field({ nullable: true })
  postalCode?: string

  @Field({ nullable: true })
  city?: string

  @Field({ nullable: true })
  phone?: string
}
