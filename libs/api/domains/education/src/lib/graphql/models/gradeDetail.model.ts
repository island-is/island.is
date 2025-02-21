import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('EducationPrimarySchoolGradeDetail')
export class GradeDetail {
  @Field()
  grade!: string

  @Field(() => Int, { nullable: true })
  weight?: number

  @Field({ nullable: true })
  label?: string
}
