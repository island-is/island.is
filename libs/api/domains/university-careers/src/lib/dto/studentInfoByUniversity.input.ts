import { UniversityId } from '@island.is/clients/university-careers'
import { Field, InputType } from '@nestjs/graphql'
import { IsEnum, IsNumber, IsString } from 'class-validator'

@InputType('UniversityCareersStudentInfoByUniversityInput')
export class StudentInfoByUniversityInput {
  @Field(() => UniversityId)
  @IsEnum(UniversityId)
  universityId!: UniversityId

  @Field()
  @IsNumber()
  trackNumber!: number

  @Field()
  @IsString()
  locale!: string
}
