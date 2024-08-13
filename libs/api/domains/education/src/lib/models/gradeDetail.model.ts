import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('EducationCompulsorySchoolGradeDetail')
export class GradeDetail {
  @Field(() => Int)
  grade!: number

  @Field(() => Int, { nullable: true })
  weight?: number

  @Field({ nullable: true })
  label?: string
}
