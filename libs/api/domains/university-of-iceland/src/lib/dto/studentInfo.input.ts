import { Field, InputType } from '@nestjs/graphql'
import { IsNumber, IsOptional, IsString } from 'class-validator'

@InputType('UniversityOfIcelandStudentInfoInput')
export class StudentInfoInput {
  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  trackNumber?: number

  @Field()
  @IsString()
  locale!: string
}
