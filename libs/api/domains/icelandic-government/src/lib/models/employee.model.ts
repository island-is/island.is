import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Location } from './location.model'

@ObjectType('IcelandicGovernmentEmployee')
export class Employee {
  @Field()
  name!: string

  @Field({ nullable: true })
  job?: string

  @Field({ nullable: true })
  email?: string

  @Field(() => Int, { nullable: true })
  phoneNumber?: number

  @Field({ nullable: true })
  location?: Location

  @Field({ nullable: true })
  department?: string

  @Field({ nullable: true })
  currentlyActive?: boolean
}
