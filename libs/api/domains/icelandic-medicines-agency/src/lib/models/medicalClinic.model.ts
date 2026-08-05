import { Field, ID, ObjectType } from '@nestjs/graphql'

import { IcelandicMedicinesAgencyPharmacyContact } from './pharmacyContact.model'
import { IcelandicMedicinesAgencyPharmacyOperator } from './pharmacyOperator.model'
import { IcelandicMedicinesAgencyPharmacyRegion } from './enums'

@ObjectType({ implements: () => [IcelandicMedicinesAgencyPharmacyContact] })
export class IcelandicMedicinesAgencyMedicalClinic extends IcelandicMedicinesAgencyPharmacyContact {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  fax?: string

  @Field({ nullable: true })
  email?: string

  @Field(() => IcelandicMedicinesAgencyPharmacyRegion, { nullable: true })
  region?: IcelandicMedicinesAgencyPharmacyRegion

  @Field(() => IcelandicMedicinesAgencyPharmacyOperator, { nullable: true })
  operator?: IcelandicMedicinesAgencyPharmacyOperator
}
