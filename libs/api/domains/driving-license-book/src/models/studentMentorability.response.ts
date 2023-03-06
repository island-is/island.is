import { Field, ObjectType } from '@nestjs/graphql'
@ObjectType()
export class StudentMentorability {
  @Field()
  eligible!: boolean
}
