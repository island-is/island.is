import { Field, ID, ObjectType } from '@nestjs/graphql'
import type { ICourseListPage } from '../generated/contentfulTypes'

@ObjectType()
export class CourseListPage {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  title!: string
}

export const mapCourseListPage = (
  courseListPage: ICourseListPage,
): CourseListPage => {
  return {
    id: courseListPage.sys.id,
    title: courseListPage.fields.title ?? '',
  }
}
