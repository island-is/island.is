import { Field, ObjectType } from '@nestjs/graphql'
import { IsNotEmpty, IsString, IsOptional } from 'class-validator'

@ObjectType()
export class StudentInformation {
  @Field()
  name!: string
}

@ObjectType()
export class StudentInformationResult {
  @Field(() => StudentInformation, { nullable: true })
  student!: StudentInformation | null
}
