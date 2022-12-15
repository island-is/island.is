import { PropertyLocation } from './propertyUnitsOfUse.model'
import { PagingData } from './propertyOwners.model'
import { PropertyDetail } from './propertyDetail.model'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class SimpleProperties {
  @Field({ nullable: true })
  propertyNumber?: string

  @Field(() => PropertyLocation, { nullable: true })
  defaultAddress?: PropertyLocation
}

@ObjectType()
export class PropertyOverview {
  @Field(() => [SimpleProperties], { nullable: true })
  properties?: SimpleProperties[]

  @Field({ nullable: true })
  paging?: PagingData
}
