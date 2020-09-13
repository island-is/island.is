import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql'

export enum AccessCategoryEnum {
  XROAD = 'X-Road',
  APIGW = 'API GW',
}

export enum PricingCategoryEnum {
  FREE = 'free',
  USAGE = 'usage',
  DAILY = 'daily',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  CUSTOM = 'custom',
}

export enum DataCategoryEnum {
  PUBLIC = 'public',
  OFFICIAL = 'official',
  PERSONAL = 'personal',
  HEALTH = 'health',
  FINANCIAL = 'financial',
}

export enum TypeCategoryEnum {
  REST = 'REST',
  SOAP = 'SOAP',
  GRAPHQL = 'GraphQL',
}

registerEnumType(AccessCategoryEnum, {
  name: 'accessCategoryEnum',
})

registerEnumType(PricingCategoryEnum, {
  name: 'PricingCategoryEnum',
})

registerEnumType(DataCategoryEnum, {
  name: 'DataCategoryEnum',
})

registerEnumType(TypeCategoryEnum, {
  name: 'TypeCategoryEnum',
})

@ObjectType()
export class ApiCatalogue {
  @Field(() => ID)
  id: string

  @Field()
  owner: string

  @Field()
  serviceName: string

  @Field()
  description: string

  @Field()
  url: string

  @Field(() => PricingCategoryEnum)
  pricing: PricingCategoryEnum

  @Field(() => DataCategoryEnum)
  data: DataCategoryEnum

  @Field(() => TypeCategoryEnum)
  type: TypeCategoryEnum

  @Field(() => AccessCategoryEnum)
  access: AccessCategoryEnum
}
