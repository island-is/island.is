import { Field, ObjectType } from '@nestjs/graphql'

import { IcelandicMedicinesAgencyPharmacyContact } from './pharmacyContact.model'

@ObjectType({ implements: () => [IcelandicMedicinesAgencyPharmacyContact] })
export class IcelandicMedicinesAgencyPharmacyOperator extends IcelandicMedicinesAgencyPharmacyContact {
  @Field({ nullable: true })
  nationalId?: string
}
