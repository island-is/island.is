import { Field, ObjectType, ID, Int } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { ICourse, ICourseInstance } from '../generated/contentfulTypes'
import { mapDocument, SliceUnion } from '../unions/slice.union'
import { GenericTag, mapGenericTag } from './genericTag.model'
import { GetCoursesInput } from '../dto/getCourses.input'
import { GetCourseSelectOptionsInput } from '../dto/getCourseSelectOptions.input'

@ObjectType()
class CourseInstanceTimeDuration {
  @Field(() => String, { nullable: true })
  startTime?: string

  @Field(() => String, { nullable: true })
  endTime?: string
}

@ObjectType()
export class CourseInstance {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  startDate!: string

  @CacheField(() => CourseInstanceTimeDuration, { nullable: true })
  startDateTimeDuration?: CourseInstanceTimeDuration | null

  @Field(() => String, { nullable: true })
  location?: string | null

  @Field(() => String, { nullable: true })
  displayedTitle?: string | null

  @Field(() => String)
  description!: string

  @Field(() => String, { nullable: true })
  chargeItemCode?: string | null
}

const mapCourseInstance = ({
  fields,
  sys,
}: ICourseInstance): CourseInstance => {
  const startTime = fields.startDateTimeDuration?.startTime
  const endTime = fields.startDateTimeDuration?.endTime
  return {
    id: sys.id,
    startDate: fields.startDate ?? '',
    location: fields.location ?? null,
    displayedTitle: fields.displayedTitle ?? null,
    description: fields.description ?? '',
    startDateTimeDuration: startTime ? { startTime, endTime } : null,
    chargeItemCode: fields.chargeItemCode ?? null,
  }
}

@ObjectType()
export class Course {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  title!: string

  @CacheField(() => [SliceUnion], { nullable: true })
  cardIntro?: Array<typeof SliceUnion>

  @CacheField(() => [SliceUnion])
  description!: Array<typeof SliceUnion>

  @CacheField(() => [GenericTag])
  categories!: GenericTag[]

  @CacheField(() => [CourseInstance])
  instances!: CourseInstance[]

  @Field(() => String, { nullable: true })
  courseListPageId?: string | null
}

@ObjectType()
class CourseActiveLocales {
  @Field(() => Boolean)
  is!: boolean

  @Field(() => Boolean)
  en!: boolean
}

@ObjectType()
export class CourseDetails {
  @CacheField(() => Course, { nullable: true })
  course?: Course | null

  @CacheField(() => CourseActiveLocales, { nullable: true })
  activeLocales?: CourseActiveLocales | null
}

export const mapCourse = ({ fields, sys }: ICourse): Course => {
  return {
    id: sys.id,
    title: (fields.title ?? '').trim(),
    cardIntro: fields.cardIntro
      ? mapDocument(fields.cardIntro, `${sys.id}:cardIntro`)
      : [],
    description: fields.description
      ? mapDocument(fields.description, `${sys.id}:description`)
      : [],
    categories: fields.categories ? fields.categories.map(mapGenericTag) : [],
    instances: fields.instances ? fields.instances.map(mapCourseInstance) : [],
    courseListPageId: fields.courseListPage?.sys?.id ?? null,
  }
}

@ObjectType()
export class CourseList {
  @Field(() => Int)
  total!: number

  @CacheField(() => [Course])
  items!: Course[]

  @CacheField(() => GetCoursesInput)
  input!: GetCoursesInput
}

@ObjectType()
class CourseCategory {
  @Field(() => String)
  key!: string

  @Field(() => String)
  label!: string
}

@ObjectType()
export class CourseCategoriesResponse {
  @CacheField(() => [CourseCategory])
  items!: CourseCategory[]
}

@ObjectType()
class CourseSelectOption {
  @Field(() => String)
  id!: string

  @Field(() => String)
  title!: string
}

@ObjectType()
export class CourseSelectOptionsResponse {
  @CacheField(() => [CourseSelectOption])
  items!: CourseSelectOption[]

  @Field(() => Int)
  total!: number

  @CacheField(() => GetCourseSelectOptionsInput)
  input!: GetCourseSelectOptionsInput
}
