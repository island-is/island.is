import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetChargeItemSubjectsByYearInput {
  @Field()
  @IsString()
  year!: string

  @Field()
  @IsString()
  typeId!: string

  @Field()
  @IsString()
  nextKey!: string
}
