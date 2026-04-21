import { UniversityId } from '@island.is/clients/university-careers'
import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { UniversityCareersStudyType } from '../universityCareers.types'

registerEnumType(UniversityId, { name: 'UniversityCareersUniversityId' })
registerEnumType(UniversityCareersStudyType, {
  name: 'UniversityCareersStudyType',
})

@InputType('UniversityCareersStudentInfoInput')
export class StudentInfoInput {
  @Field()
  @IsString()
  locale!: string

  @Field(() => UniversityCareersStudyType, { nullable: true })
  @IsOptional()
  @IsEnum(UniversityCareersStudyType)
  studyType?: UniversityCareersStudyType
}
