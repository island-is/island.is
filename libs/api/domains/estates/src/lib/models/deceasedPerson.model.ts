import { Field, ObjectType } from '@nestjs/graphql'

import { EstatesDateFieldValue, EstatesFieldValue } from './fieldValue.model'

@ObjectType('EstatesDeceasedPerson')
export class DeceasedPerson {
  @Field({ nullable: true })
  title?: string

  @Field(() => EstatesFieldValue, { nullable: true })
  name?: EstatesFieldValue

  @Field(() => EstatesFieldValue, { nullable: true })
  nationalId?: EstatesFieldValue

  @Field(() => EstatesDateFieldValue, { nullable: true })
  dateOfDeath?: EstatesDateFieldValue
}
