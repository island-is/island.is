import { Field, InputType } from '@nestjs/graphql'
import { IsArray, IsString } from 'class-validator'

@InputType()
export class ExcelSheetInput {
  @Field((type) => [String], { nullable: true })
  @IsArray()
  headers!: Array<string | number>

  @Field((type) => [[String]], { nullable: true })
  @IsArray()
  data!: (string | number)[][]

  @Field()
  @IsString()
  token!: string
}
