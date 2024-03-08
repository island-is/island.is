import { UniversityId } from '@island.is/clients/university-careers'
import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'

registerEnumType(UniversityId, { name: 'UniversityCareersUniversityId' })

@InputType('UniversityCareersStudentInfoInput')
export class StudentInfoInput {
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
