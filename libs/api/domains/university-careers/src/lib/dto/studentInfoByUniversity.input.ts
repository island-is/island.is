import { Field, InputType } from '@nestjs/graphql'
import { IsNumber, IsOptional, IsString } from 'class-validator'

@InputType('UniversityCareersStudentInfoByUniversityInput')
export class StudentInfoByUniversityInput {
  @Field()
  @IsString()
  @IsOptional()
  universityId!: string

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  trackNumber?: number

  @Field()
  @IsString()
  locale!: string
}
