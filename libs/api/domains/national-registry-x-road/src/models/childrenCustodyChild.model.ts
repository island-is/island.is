import { Field, ObjectType } from '@nestjs/graphql'
import { ChildrenCustodyPerson } from './childrenCustodyPerson.model'

@ObjectType()
export class ChildrenCustodyChild {
  @Field(() => String)
  nationalId!: string

  @Field(() => String)
  fullName!: string

  @Field(() => Boolean)
  livesWithApplicant!: boolean

  @Field(() => Boolean)
  livesWithBothParents!: boolean

  @Field(() => ChildrenCustodyPerson)
  otherParent!: ChildrenCustodyPerson
}
