import { Field, ObjectType } from '@nestjs/graphql'
import { PropertyOwnersModel } from './propertyOwners.model'

@ObjectType()
export class LandModel {
  @Field({ nullable: true })
  landNumber?: string

  @Field({ nullable: true })
  landAppraisal?: number

  @Field({ nullable: true })
  useDisplay?: string

  @Field({ nullable: true })
  area?: string

  @Field({ nullable: true })
  areaUnit?: string

  @Field(() => PropertyOwnersModel, { nullable: true })
  registeredOwners?: PropertyOwnersModel
}
