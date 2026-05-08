import { UniversityId } from '@island.is/clients/university-careers'
import { Field, InputType } from '@nestjs/graphql'
import { IsEnum, IsNumber, IsOptional } from 'class-validator'
import { LocaleEnum } from '@island.is/nest/graphql'

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
  @IsEnum(LocaleEnum)
  locale: LocaleEnum = LocaleEnum.Is
}
