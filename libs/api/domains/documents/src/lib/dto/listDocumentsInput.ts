import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsDate } from 'class-validator'

@InputType()
export class ListDocumentsInput {

  @Field()
  @IsString()
  natReg: string

  @Field()
  @IsDate()
  dateFrom: Date

  @Field()
  @IsDate()
  dateTo: Date

  @Field()
  @IsString()
  category: string
}
