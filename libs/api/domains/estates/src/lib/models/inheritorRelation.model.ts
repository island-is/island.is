import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('EstatesInheritorRelation')
export class InheritorRelation {
  @Field({ nullable: true, description: 'Relation code from the API' })
  code?: string

  @Field({ nullable: true })
  text?: string
}
