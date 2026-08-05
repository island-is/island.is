import { Field, ObjectType } from '@nestjs/graphql'

import { IcelandicMedicinesAgencyPharmacyContact } from './pharmacyContact.model'

@ObjectType({ implements: () => [IcelandicMedicinesAgencyPharmacyContact] })
export class IcelandicMedicinesAgencyPharmacyBranch extends IcelandicMedicinesAgencyPharmacyContact {
  @Field({ nullable: true })
  fax?: string

  @Field({ nullable: true })
  email?: string

  @Field({ nullable: true })
  category?: string
}
