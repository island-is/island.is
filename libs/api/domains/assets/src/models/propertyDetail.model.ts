import {
  PropertyLocation,
  Appraisal,
  UnitsOfUseModel,
} from './propertyUnitsOfUse.model'
import { PropertyOwnersModel } from './propertyOwners.model'
import { LandModel } from './Land.model'
import {
  Extensions,
  Field,
  MiddlewareContext,
  ObjectType,
} from '@nestjs/graphql'

const isNotOwner = ({ source }: MiddlewareContext): boolean => {
  const owners = (source as PropertyDetail).registeredOwners?.registeredOwners
  if (!owners) return true
  return owners.some((owner) => owner.ssn == source.nationalId)
}
@Extensions({
  filterFields: {
    condition: isNotOwner,
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
