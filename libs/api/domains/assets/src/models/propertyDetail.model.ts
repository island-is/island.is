import {
  PropertyLocation,
  Appraisal,
  UnitsOfUseModel,
} from './propertyUnitsOfUse.model'
import { PropertyOwnersModel } from './propertyOwners.model'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PropertyDetail {
  @Field(() => UnitsOfUseModel, { nullable: true })
  unitsOfUse?: UnitsOfUseModel | null

  @Field(() => PropertyOwnersModel, { nullable: true })
  registeredOwners?: PropertyOwnersModel | null

  @Field(() => Appraisal, { nullable: true })
  appraisal?: Appraisal | null

  @Field(() => PropertyLocation, { nullable: true })
  defaultAddress?: PropertyLocation | undefined

  @Field({ nullable: true })
  propertyNumber?: string
}
