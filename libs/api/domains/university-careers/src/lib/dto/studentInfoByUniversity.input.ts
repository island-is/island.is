import { UniversityId } from '@island.is/clients/university-careers'
import { Field, InputType } from '@nestjs/graphql'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'

@InputType('UniversityCareersStudentInfoByUniversityInput')
export class StudentInfoByUniversityInput {
  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  trackNumber?: number

  @Field()
  @IsString()
  locale!: string

  @Field(() => UniversityId, { nullable: true })
  @IsEnum(UniversityId)
  @IsOptional()
  universityId?: UniversityId
}
