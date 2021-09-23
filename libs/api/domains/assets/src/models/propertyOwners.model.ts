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
  nafn?: string | undefined

  @Field({ nullable: true })
  kennitala?: string | undefined

  @Field({ nullable: true })
  eignarhlutfall?: number

  @Field({ nullable: true })
  kaupdagur?: Date | undefined

  @Field({ nullable: true })
  heimildBirting?: string
}

@ObjectType()
export class PropertyOwnersModel {
  @Field(() => PagingData, { nullable: true })
  paging?: PagingData

  @Field(() => [PropertyOwner], { nullable: true })
  data?: PropertyOwner[]
}
