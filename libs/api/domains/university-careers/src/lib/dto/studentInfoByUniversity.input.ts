import { UniversityId } from '@island.is/clients/university-careers'
import { Field, InputType } from '@nestjs/graphql'
import { IsEnum, IsNumber, IsOptional } from 'class-validator'
import { LocaleEnum } from '@island.is/nest/graphql'
import { IsLocale } from '@island.is/nest/core'
import { Locale } from '@island.is/shared/types'

@InputType('UniversityCareersStudentInfoByUniversityInput')
export class StudentInfoByUniversityInput {
  @Field(() => UniversityId)
  @IsEnum(UniversityId)
  universityId!: UniversityId

  @Field()
  @IsNumber()
  trackNumber!: number

  @Field(() => LocaleEnum, { nullable: true, defaultValue: LocaleEnum.Is })
  @IsOptional()
  @IsLocale()
  locale?: Locale
}
