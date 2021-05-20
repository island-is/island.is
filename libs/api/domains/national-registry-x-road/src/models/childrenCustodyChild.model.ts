import { Field, ObjectType } from '@nestjs/graphql'
import { NationalRegistryPerson } from './nationalRegistryPerson.model'

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

  @Field(() => NationalRegistryPerson)
  otherParent!: NationalRegistryPerson
}
