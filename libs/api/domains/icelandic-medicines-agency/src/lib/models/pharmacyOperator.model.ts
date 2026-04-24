import { Field, ObjectType } from '@nestjs/graphql'

import { IcelandicMedicinesAgencyPharmacyContact } from './pharmacyContact.model'

@ObjectType({
  implements: () => [IcelandicMedicinesAgencyPharmacyContact],
})
export class IcelandicMedicinesAgencyPharmacyOperator extends IcelandicMedicinesAgencyPharmacyContact {
  @Field({
    description: 'Company national id',
    nullable: true,
  })
  nationalId?: string
}
