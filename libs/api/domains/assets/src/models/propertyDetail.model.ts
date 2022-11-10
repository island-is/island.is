import {
  PropertyLocation,
  Appraisal,
  UnitsOfUseModel,
} from './propertyUnitsOfUse.model'
import { PropertyOwner } from './propertyOwners.model'
import { LandModel } from './Land.model'
import { Extensions, Field, ObjectType } from '@nestjs/graphql'
import { MiddlewareContext } from '@nestjs/graphql'

function isPropertyOwner({ source }: MiddlewareContext) {
  const owners: [PropertyOwner] = source.registeredOwners?.registeredOwners
  if (!owners) return false
  return owners.some((owner) => owner.ssn == source.nationalId)
}
@Extensions({
  filterFields: {
    condition: !isPropertyOwner,
    fields: ['defaultAddress', 'land', 'propertyNumber'],
  },
})
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

  @Field(() => LandModel, { nullable: true })
  land?: LandModel

  @Field({ nullable: true })
  propertyNumber?: string
}
