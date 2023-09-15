import { Field, ObjectType } from '@nestjs/graphql'

export
@ObjectType('ProgramFilter')
class ProgramFilter {
  @Field()
  field!: string

  @Field(() => [String])
  options!: string[]
}
