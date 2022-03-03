import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'

import {
  AccessCategory,
  DataCategory,
  Environment,
  PricingCategory,
  TypeCategory,
} from '@island.is/api-catalogue/consts'

import { PageInfo } from './pageInfo.model'
import { Service } from './service.model'

registerEnumType(AccessCategory, {
  name: 'AccessCategory',
})

registerEnumType(DataCategory, {
  name: 'DataCategory',
})

registerEnumType(PricingCategory, {
  name: 'PricingCategory',
})

registerEnumType(TypeCategory, {
  name: 'TypeCategory',
})

registerEnumType(Environment, {
  name: 'Environment',
})

@ObjectType()
export class ApiCatalogue {
  @Field(() => [Service])
  services!: Service[]

  @Field(() => PageInfo, { nullable: true })
  @IsOptional()
  pageInfo?: PageInfo
}
