import { Allow, IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType('IntellectualPropertyInput')
export class GetIntellectualPropertyInput {
  @Allow()
  @Field()
  @IsString()
  key!: string
}
