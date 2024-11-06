import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('EducationCompulsorySchoolGradeDetail')
export class GradeDetail {
  @Field()
  grade!: string

  @Field(() => Int, { nullable: true })
  weight?: number

  @Field({ nullable: true })
  label?: string
}
