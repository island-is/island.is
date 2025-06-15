import { Field, InputType } from '@nestjs/graphql'

@InputType('EducationV3PrimarySchoolCareerInput')
export class PrimarySchoolCareerInput {
  @Field()
  readonly studentId!: string
}
