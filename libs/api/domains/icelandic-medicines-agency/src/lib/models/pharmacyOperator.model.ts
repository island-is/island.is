import { Field, ObjectType } from '@nestjs/graphql'

import { IcelandicMedicinesAgencyPharmacyContact } from './pharmacyContact.model'

@ObjectType({
  description: 'Company national id',
  implements: () => [IcelandicMedicinesAgencyPharmacyContact],
})
export class IcelandicMedicinesAgencyPharmacyOperator extends IcelandicMedicinesAgencyPharmacyContact {
  @Field({ nullable: true })
  nationalId?: string
}
