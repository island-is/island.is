import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsDate, IsNumber } from 'class-validator'

@InputType()
export class ListDocumentsInput {
  @Field()
  @IsString()
  natReg: string
}
