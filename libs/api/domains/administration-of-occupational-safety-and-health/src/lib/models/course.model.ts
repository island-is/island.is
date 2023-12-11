import { CacheField } from '@island.is/nest/graphql'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('AdministrationofOccupationalSafetyandHealthCourseModel')
export class Course {
  @Field(() => Number)
  id!: number

  @Field(() => String)
  name!: string

  @Field(() => String)
  dateFrom!: string

  @Field(() => String)
  dateTo!: string

  @Field(() => String)
  time!: string

  @Field(() => String)
  location!: string

  @Field(() => Number)
  price!: number

  @Field(() => String)
  registrationUrl!: string

  @Field(() => String)
  status!: string

  @Field(() => String)
  category!: string

  @Field(() => String)
  subCategory!: string

  @Field(() => String)
  description!: string

  @Field(() => Boolean, { nullable: true })
  alwaysOpen?: boolean
}

@ObjectType('AdministrationofOccupationalSafetyandHealthCoursesResponseModel')
export class CoursesResponse {
  @CacheField(() => [Course])
  courses!: Course[]
}
