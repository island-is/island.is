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
import { GraphQLContext } from '@island.is/auth-nest-tools'

const isLoggedIn = ({ context }: MiddlewareContext): boolean => {
  const ctx = context as GraphQLContext
  const user = ctx.req.user
  if (!user) return false
  return !!user.nationalId
}
@Extensions({
  filterFields: {
    condition: isLoggedIn,
    fields: [
      'unitsOfUse',
      'registeredOwners',
      'appraisal',
      'defaultAddress',
      'land',
      'propertyNumber',
      'nonexistingField',
    ],
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
