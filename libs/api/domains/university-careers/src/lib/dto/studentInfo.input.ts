import { Field, InputType } from '@nestjs/graphql'
import { IsEnum, IsOptional } from 'class-validator'
import { LocaleEnum } from '@island.is/nest/graphql'
import { StudyType } from '../universityCareers.types'

@InputType('UniversityCareersStudentInfoInput')
export class StudentInfoInput {
  @Field(() => LocaleEnum, { nullable: true, defaultValue: LocaleEnum.Is })
  @IsOptional()
  @IsEnum(LocaleEnum)
  locale: LocaleEnum = LocaleEnum.Is

  @Field(() => StudyType, {
    nullable: true,
    defaultValue: StudyType.UNIVERSITY_STUDIES,
  })
  @IsOptional()
  @IsEnum(StudyType)
  studyType?: StudyType
}
