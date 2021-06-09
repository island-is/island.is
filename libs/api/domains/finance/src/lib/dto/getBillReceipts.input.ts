import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetBillReceiptsInput {
  @Field()
  @IsString()
  dayFrom!: string

  @Field()
  @IsString()
  dayTo!: string
}
