import { Field, ObjectType } from '@nestjs/graphql'

import { PropertyOwnersModel } from './propertyOwners.model'
import {
  Appraisal,
  PropertyLocation,
  UnitsOfUseModel,
} from './propertyUnitsOfUse.model'

@ObjectType()
export class PropertyDetail {
  @Field(() => UnitsOfUseModel, { nullable: true })
  unitsOfUse?: UnitsOfUseModel

  @Field(() => PropertyOwnersModel, { nullable: true })
  registeredOwners?: PropertyOwnersModel

  @Field(() => Appraisal, { nullable: true })
  appraisal?: Appraisal

  @Field(() => PropertyLocation, { nullable: true })
  defaultAddress?: PropertyLocation

  @Field({ nullable: true })
  propertyNumber?: string
}
