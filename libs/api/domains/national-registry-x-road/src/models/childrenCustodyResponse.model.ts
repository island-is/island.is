import { Field, ObjectType } from '@nestjs/graphql'
import { ChildrenCustodyAddress } from './childrenCustodyAddress.model'
import { ChildrenCustodyChild } from './childrenCustodyChild.model'

@ObjectType()
export class ChildrenCustodyResponse {
  @Field(() => String)
  nationalId!: string

  @Field(() => String)
  fullName!: string

  @Field(() => ChildrenCustodyAddress)
  address!: ChildrenCustodyAddress

  @Field(() => [ChildrenCustodyChild])
  children!: ChildrenCustodyChild[]
}
