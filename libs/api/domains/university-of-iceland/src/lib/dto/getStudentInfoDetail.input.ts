import { Field, InputType } from '@nestjs/graphql'
import { IsNumber, IsString } from 'class-validator'

@InputType()
export class GetStudentInfoDetailInput {
  @Field()
  @IsNumber()
  trackNumber!: number

  @Field()
  @IsString()
  locale!: string
}
