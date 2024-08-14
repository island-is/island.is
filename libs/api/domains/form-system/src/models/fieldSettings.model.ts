import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('FormSystemFieldSettings')
export class FieldSettings {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  created?: Date

  @Field(() => Date, { nullable: true })
  modified?: Date


}
