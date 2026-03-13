import { Field, ID, ObjectType } from '@nestjs/graphql'

import { IcelandicMedicinesAgencyPharmacyBranch } from './pharmacyBranch.model'
import { IcelandicMedicinesAgencyPharmacyContact } from './pharmacyContact.model'
import { IcelandicMedicinesAgencyPharmacyOperator } from './pharmacyOperator.model'

@ObjectType()
export class IcelandicMedicinesAgencyPharmacy extends IcelandicMedicinesAgencyPharmacyContact {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  fax?: string

  @Field({ nullable: true })
  email?: string

  @Field({ nullable: true })
  licenseHolder?: string

  @Field(() => IcelandicMedicinesAgencyPharmacyOperator, { nullable: true })
  operator?: IcelandicMedicinesAgencyPharmacyOperator

  @Field(() => [IcelandicMedicinesAgencyPharmacyBranch])
  branches!: IcelandicMedicinesAgencyPharmacyBranch[]
}
