import { Field, ObjectType } from '@nestjs/graphql'
import { ChildrenCustodyAddress } from './childrenCustodyAddress'

@ObjectType()
export class ChildrenCustodyPerson {
  @Field(() => String)
  nationalId!: string

  @Field(() => String)
  fullName!: string

  @Field(() => ChildrenCustodyAddress)
  address!: ChildrenCustodyAddress
}
