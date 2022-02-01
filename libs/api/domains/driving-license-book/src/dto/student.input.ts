import { IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class StudentInput {
  @Field({ nullable: true })
  @IsString()
  ssn!: string

}
