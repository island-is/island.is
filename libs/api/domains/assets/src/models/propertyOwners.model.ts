import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PagingData {
  @Field({ nullable: true })
  page?: number

  @Field({ nullable: true })
  pageSize?: number

  @Field({ nullable: true })
  totalPages?: number

  @Field({ nullable: true })
  offset?: number

  @Field({ nullable: true })
  total?: number

  @Field({ nullable: true })
  hasPreviousPage?: boolean

  @Field({ nullable: true })
  hasNextPage?: boolean
}

@ObjectType()
export class PropertyOwner {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  ssn?: string

  @Field({ nullable: true })
  ownership?: number

  @Field({ nullable: true })
  purchaseDate?: Date

  @Field({ nullable: true })
  grantDisplay?: string
}

@ObjectType()
export class PropertyOwnersModel {
  @Field(() => PagingData, { nullable: true })
  paging?: PagingData

  @Field(() => [PropertyOwner], { nullable: true })
  registeredOwners?: PropertyOwner[]
}
