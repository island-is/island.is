import { Field, ID, ObjectType } from '@nestjs/graphql'

import { IcelandicMedicinesAgencyPharmacyContact } from './pharmacyContact.model'

@ObjectType({ implements: () => [IcelandicMedicinesAgencyPharmacyContact] })
export class IcelandicMedicinesAgencyWholesaler extends IcelandicMedicinesAgencyPharmacyContact {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  fax?: string

  @Field({ nullable: true })
  email?: string
}
