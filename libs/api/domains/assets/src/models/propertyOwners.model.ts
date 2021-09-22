import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PagingData {
  @Field()
  page?: number

  @Field()
  pageSize?: number

  @Field()
  totalPages?: number

  @Field()
  offset?: number

  @Field()
  total?: number

  @Field()
  hasPreviousPage?: boolean

  @Field()
  hasNextPage?: boolean
}

@ObjectType()
export class PropertyOwner {
  @Field()
  nafn?: string

  @Field()
  kennitala?: string

  @Field({ nullable: true })
  eignarhlutfall?: number

  @Field()
  kaupdagur?: Date

  @Field({ nullable: true })
  heimild?: string

  @Field({ nullable: true })
  display?: string

  @Field({ nullable: true })
  heimildBirting?: string
}

@ObjectType()
export class PropertyOwnersModel {
  @Field(() => PagingData, { nullable: true })
  paging!: PagingData

  @Field(() => [PropertyOwner])
  data!: PropertyOwner[]
}
