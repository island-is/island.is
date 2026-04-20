import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType('LawAndOrderSubpoenaInput')
export class GetSubpoenaInput {
  @Field()
  @IsString()
  id!: string
}
