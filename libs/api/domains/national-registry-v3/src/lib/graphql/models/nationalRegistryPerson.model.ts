import { Field, ObjectType, ID } from '@nestjs/graphql'
import { Name } from './nationalRegistryName.model'

@ObjectType('NationalRegistryV3Person')
export class Person {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String, { nullable: true })
  fullName?: string | null

  @Field(() => String, { nullable: true })
  gender?: string | null

  @Field(() => Boolean, { nullable: true })
  exceptionFromDirectMarketing?: boolean | null

  @Field(() => String, { nullable: true })
  fate?: string | null
}
