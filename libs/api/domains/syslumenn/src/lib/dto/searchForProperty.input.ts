import { IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class SearchForPropertyInput {
  @Field()
  @IsString()
  propertyNumber!: string
}
