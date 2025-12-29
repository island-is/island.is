import { ID, Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CourseListPage {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  title!: string
}
