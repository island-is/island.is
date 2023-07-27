import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PeriodsModel {
  @Field(() => [PeriodItems], { nullable: true })
  items?: Array<PeriodItems>
}

@ObjectType()
export class CoursesModel {
  @Field(() => String, { nullable: true })
  courseName?: string

  @Field(() => String, { nullable: true })
  courseId?: string

  @Field(() => String, { nullable: true })
  finalgrade?: string

  @Field(() => String, { nullable: true })
  units?: number

  @Field(() => String, { nullable: true })
  stage?: string

  @Field(() => String, { nullable: true })
  status?: string

  @Field(() => String, { nullable: true })
  date?: string
}

@ObjectType()
export class PeriodItems {
  @Field(() => [CoursesModel], { nullable: true })
  courses?: Array<CoursesModel>

  @Field(() => String, { nullable: true })
  division?: string

  @Field(() => String, { nullable: true })
  divisionShort?: string

  @Field(() => String, { nullable: true })
  organisation?: string

  @Field(() => String, { nullable: true })
  organisationShort?: string

  @Field(() => String, { nullable: true })
  periodFrom?: string

  @Field(() => String, { nullable: true })
  periodName?: string

  @Field(() => String, { nullable: true })
  periodShort?: string

  @Field(() => String, { nullable: true })
  periodTo?: string
}
