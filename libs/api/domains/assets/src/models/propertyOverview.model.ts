import { PropertyLocation } from './propertyUnitsOfUse.model'
import { PagingData } from './propertyOwners.model'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class SimpleProperties {
  @Field({ nullable: true })
  propertyNumber?: string | undefined

  @Field(() => PropertyLocation, { nullable: true })
  defaultAddress?: PropertyLocation | undefined
}

@ObjectType()
export class PropertyOverview {
  @Field(() => [SimpleProperties], { nullable: true })
  properties?: SimpleProperties[] | undefined

  @Field({ nullable: true })
  paging?: PagingData | null
}
