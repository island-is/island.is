import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import type { ICourseListPage } from '../generated/contentfulTypes'
import { mapDocument, SliceUnion } from '../unions/slice.union'

@ObjectType()
export class CourseListPage {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  title!: string

  @CacheField(() => [SliceUnion], { nullable: true })
  content?: Array<typeof SliceUnion>
}

export const mapCourseListPage = (
  courseListPage: ICourseListPage,
): CourseListPage => {
  return {
    id: courseListPage.sys.id,
    title: courseListPage.fields.title ?? '',
    content: courseListPage.fields.content
      ? mapDocument(
          courseListPage.fields.content,
          courseListPage.sys.id + ':content',
        )
      : [],
  }
}
