import { Field, InputType } from '@nestjs/graphql'
import { IsEnum, IsOptional } from 'class-validator'
import { IsLocale } from '@island.is/nest/core'
import { LocaleEnum } from '@island.is/nest/graphql'
import { Locale } from '@island.is/shared/types'
import { StudyType } from '../universityCareers.types'

@InputType('UniversityCareersStudentInfoInput')
export class StudentInfoInput {
  @Field(() => LocaleEnum, { nullable: true, defaultValue: LocaleEnum.Is })
  @IsOptional()
  @IsLocale()
  locale?: Locale

  @Field(() => StudyType, { nullable: true })
  @IsOptional()
  @IsEnum(StudyType)
  studyType?: StudyType
}
