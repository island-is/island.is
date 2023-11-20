import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Person } from './person.model'

@ObjectType('NationalRegistryChildCustody')
export class ChildCustody {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String, { nullable: true })
  fullName!: string | null

  @Field(() => Person, { nullable: true })
  details?: Person
}
