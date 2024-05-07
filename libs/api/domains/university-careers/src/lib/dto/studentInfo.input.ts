import { UniversityId } from '@island.is/clients/university-careers'
import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

registerEnumType(UniversityId, { name: 'UniversityCareersUniversityId' })

@InputType('UniversityCareersStudentInfoInput')
export class StudentInfoInput {
  @Field()
  @IsString()
  locale!: string
}
