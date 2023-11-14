import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetFinanceDocumentsListInput {
  @Field()
  @IsString()
  dayFrom!: string

  @Field()
  @IsString()
  dayTo!: string

  @Field()
  @IsString()
  listPath!: string
}
