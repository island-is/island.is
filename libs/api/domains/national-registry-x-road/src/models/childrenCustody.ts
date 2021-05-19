import { Field, ObjectType } from '@nestjs/graphql'
import { ChildrenCustodyAddress } from './childrenCustodyAddress'
import { ChildrenCustodyChild } from './childrenCustodyChild'

@ObjectType()
export class ChildrenCustody {
  @Field(() => String)
  nationalId!: string

  @Field(() => String)
  fullName!: string

  @Field(() => ChildrenCustodyAddress)
  address!: ChildrenCustodyAddress

  @Field(() => [ChildrenCustodyChild])
  children!: ChildrenCustodyChild[]
}
