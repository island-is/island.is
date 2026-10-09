import { Field, ObjectType } from '@nestjs/graphql'
import { InheritorRelation } from './inheritorRelation.model'

@ObjectType('EstatesInheritor')
export class Inheritor {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  nationalId?: string

  @Field(() => InheritorRelation, { nullable: true })
  relation?: InheritorRelation
}
