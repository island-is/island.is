import { Allow, IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType('IntellectualPropertiesInput')
export class IntellectualPropertiesInput {
  @Allow()
  @Field()
  @IsString()
  key!: string
}
